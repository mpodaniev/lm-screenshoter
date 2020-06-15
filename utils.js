const settings = require('./settings.json');
const fs = require('fs');
const path = require('path');
const backstop = require('backstopjs');
const projectsDirectoryPath = settings.projectsDirectoryPath;
const http = require('http');
const https = require('https');

const getProjectPath = function (projectName) {
  let projectPath = `${projectsDirectoryPath}${path.sep}${projectName}`;

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

const checkHttpAvailable = function (url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let statusCode = res.statusCode;

      if (statusCode === 200) {
        resolve({statusCode});
      } else {
        resolve({
          statusCode,
          message: `ERROR: Some problems with the server. Please check host availability`
        });
      }

    }).on('error', () => {
      resolve({
        message: `ERROR: Host ${url} is not available`
      });
    });
  })
}

const checkHttpsAvailable = function (url) {
  return new Promise((resolve) => {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    https.get(url, (res) => {
      let statusCode = res.statusCode;

      if (statusCode === 200) {
        resolve({statusCode});
      } else {
        resolve({
          statusCode,
          message: `ERROR: Some problems with the server. Please check host availability`
        });
      }

    }).on('error', () => {
      resolve({
        message: `ERROR: Host ${url} is not available`
      });
    });
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
  return environment === 'local' ?
    fs.readdirSync(`${getProjectPath(projectName)}${path.sep}Views${path.sep}Home`)
      .map(it => it.slice(0, it.indexOf('.'))) :
    settings.pages;
}

const getScenarios = async function (getProjectPath, projectName, environment) {
  const hostUrl = await getHostUrl(projectName, environment);
  const pages = getPages(projectName, environment);

  return pages.map(page => {
    return {
      'label': page,
      'url': hostUrl,
      'delay': 500,
      'misMatchThreshold': 0.1
    }
  });
}


exports.launchBackstop = async function (commandToRun, projectName, environment) {
  try {
    const scenarios = await getScenarios(getProjectPath, projectName, environment);

    const projectConfig = require('./backstop.config.js')({
      'project': `${projectName}/environment`,
      'scenarios': scenarios
    });

    if (commandToRun !== '') {
      backstop(commandToRun, {config: projectConfig});
    }

  } catch (e) {
    console.log(e);
  }
}

exports.projectsDirectoryPath = projectsDirectoryPath;
