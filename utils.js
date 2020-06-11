const settings = require('./settings.json');
const fs = require('fs');
const path = require('path');
const backstop = require('backstopjs');
const projectsDirectoryPath = settings.projectsDirectoryPath;
const http = require('http');

const getProjectPath = function (projectName) {
  let projectPath = `${projectsDirectoryPath}${path.sep}${projectName}`;

  if (fs.existsSync(projectPath.concat(`${path.sep}${projectName}`))) {
    projectPath = projectPath.concat(`${path.sep}${projectName}`);
  }

  return projectPath;
}

const getLocalhostUrl = function (projectName) {
  const launchSettings = require(`${getProjectPath(projectName)}${path.sep}Properties${path.sep}launchSettings.json`);
  const httpUrl = launchSettings.iisSettings.iisExpress.applicationUrl;
  // todo Need to define when to use https.
  // const sslPort = launchSettings.iisSettings.iisExpress.sslPort;
  // const httpsUrl = 'https://localhost:' + sslPort;

  return httpUrl;
}

exports.checkLocalHost = function (projectName) {
  return new Promise((resolve, reject) => {
    http.get(getLocalhostUrl(projectName), (res) => {
      let statusCode = res.statusCode;

      if (statusCode === 200) {
        resolve(true);
      } else {
        reject(`\nERROR: Some problems with the server. Please check localhost availability`);
      }

    }).on('error', () => {
      reject(`\nERROR: LocalHost ${getLocalhostUrl(projectName)} is not available`);
    });
  })
}

const getScenariosForLocalProject = function (getProjectPath, projectName) {

    const pages = fs.readdirSync(`${getProjectPath(projectName)}${path.sep}Views${path.sep}Home`)
        .map(it => it.slice(0, it.indexOf('.')));

    let scenarios;

    //todo
    // _.remove(pages, isPageToIgnore);

    scenarios = pages.map(page => {
        return {
            'label': page,
            'url': `${getLocalhostUrl(projectName)}/${page}`,
            'delay': 500,
            'misMatchThreshold' : 0.1
        }
    });

    return scenarios;
}

const getScenariosForHostProject = function (getProjectPath, projectName) {

    const pages = settings.pages;


    const scenarios = pages.map(page => {
        return {
            'label': page,
            'url': `http://${projectName.replace(/[.]/, '_')}.lmwebsites.net/${page}`,
            'delay': 500,
            'misMatchThreshold' : 0.1
        }
    });

    return scenarios;
}

exports.projectsDirectoryPath = projectsDirectoryPath;

exports.launchBackstopLocal = function (commandToRun, projectName) {
    const projectConfig = require('./backstop.config.js')({
        'project': `${projectName}/local`,
        'scenarios': getScenariosForLocalProject(getProjectPath, projectName)
    });

    if( commandToRun !== '' ) {
        backstop(commandToRun, { config: projectConfig });
    }
}

exports.launchBackstopDev = function (commandToRun, projectName) {
  const projectConfig = require('./backstop.config.js')({
    'project': `${projectName}/dev`,
    'scenarios': getScenariosForHostProject(getProjectPath, projectName)
  });

  if( commandToRun !== '' ) {
    backstop(commandToRun, { config: projectConfig });
  }
}
