const defaultSettings = require('./settings/default.settings.json');
const fs = require('fs');
const path = require('path');
const backstop = require('backstopjs');
const http = require('http');
const https = require('https');

const mergeSettings = function (obj1, obj2) {
  return {...obj1, ...obj2}
}

const userSettings = './settings/user.settings.json';
let settings = defaultSettings;
if (fs.existsSync(userSettings)) {
  settings = mergeSettings(defaultSettings, require(userSettings));
}


const getProjectsDirectoryPath = function () {
  try {
    if (!fs.existsSync(settings.projectsDirectoryPath)) {
      throw '\nERROR: You should set right directory path in parameter "projectsDirectoryPath" in "user.settings.json" file'
    }
    return settings.projectsDirectoryPath;
  } catch (e) {
    throw e;
  }
}

const getProjectPath = function (projectName) {
  let projectPath = `${getProjectsDirectoryPath()}${path.sep}${projectName}`;

  if (fs.existsSync(projectPath.concat(`${path.sep}${projectName}`))) {
    projectPath = projectPath.concat(`${path.sep}${projectName}`);
  }

  return projectPath;
}

const getLocalhostUrls = function (projectName) {
  const launchSettings = require(`${getProjectPath(projectName)}${path.sep}Properties${path.sep}launchSettings.json`);
  const httpUrl = launchSettings.iisSettings.iisExpress.applicationUrl;
  const sslPort = launchSettings.iisSettings.iisExpress.sslPort;
  const httpsUrl = 'https://localhost:' + sslPort;

  return [httpsUrl, httpUrl];
}

const response = function (resolve) {
  return (res) => {
    const statusCode = res.statusCode;

    if (statusCode === 200) {
      resolve({statusCode});
    } else {
      resolve({
        statusCode,
        message: `ERROR: Some problems with the server. Please check host availability`
      });
    }
  }
}

const responseError = function (resolve, url) {
 return () => {
   resolve({
     message: `ERROR: Host ${url} is not available`
   });
 }
}

const checkHttpsAvailable = function (url) {
  return new Promise((resolve) => {
    if (url.includes('localhost')) {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //Ignore invalid self-signed ssl certificate
    }
    https.get(url, response(resolve)).on('error', responseError(resolve, url));
  })
}

const checkHttpAvailable = function (url) {
  return new Promise((resolve) => {
    http.get(url, response(resolve)).on('error', responseError(resolve, url));
  })
}

const getHostUrl = async function (projectName, environment) {
  let httpsUrl = '';
  let httpUrl = '';
  if (environment === 'local') {
    httpsUrl = getLocalhostUrls(projectName)[0];
    httpUrl = getLocalhostUrls(projectName)[1];
  }
  if (environment === 'dev') {
    httpsUrl = `https://${projectName.replace(/[.]/g, '_')}.lmwebsites.net`;
    httpUrl = `${projectName.replace(/[.]/g, '_')}.lmwebsites.net`;
  }

  const responseHttps = await checkHttpsAvailable(httpsUrl)
  if (responseHttps.statusCode === 200) {
    return httpsUrl;
  }

  const responseHttp = await checkHttpAvailable(httpUrl)
  if (responseHttp.statusCode === 200) {
    return httpUrl;
  }

  throw `
  HTTPS Request: ${responseHttps.message}
  HTTP Request:  ${responseHttp.message}
  `;
}

const getPages = function (projectName, environment) {
  if (environment === 'local') {
    return fs.readdirSync(`${getProjectPath(projectName)}${path.sep}Views${path.sep}Home`)
      .map(it => it.slice(0, it.indexOf('.')))
  } else {
    return settings.pages;
  }
}

const getScenarios = async function (getProjectPath, projectName, environment) {
  const hostUrl = await getHostUrl(projectName, environment);
  const pages = getPages(projectName, environment);

  return pages.map(page => {
    return {
      'label': page,
      'url': `${hostUrl}/${page}`,
      'delay': 500,
      'misMatchThreshold': 0.1
    }
  });
}


exports.launchBackstop = async function (commandToRun, projectName, environment) {
  try {
    const scenarios = await getScenarios(getProjectPath, projectName, environment);

    const projectConfig = require('./backstop.config.js')({
      'project': `${projectName}/${environment}`,
      'scenarios': scenarios
    });

    if (commandToRun !== '') {
      backstop(commandToRun, {config: projectConfig});
    }

  } catch (e) {
    console.log(e);
  }
}

exports.getProjectsDirectoryPath = getProjectsDirectoryPath;
