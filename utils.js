const settings = require('./settings.json');
const fs = require('fs');
const path = require('path');
const backstop = require('backstopjs');
const projectsDirectoryPath = exports.projectsDirectoryPath = settings.projectsDirectoryPath.replace(/[\\]/g, path.sep);

const getScenariosForProject = function (projectsDirectoryPath, projectName) {
    let projectPath = `${projectsDirectoryPath}${path.sep}${projectName}`;

    if (fs.existsSync(projectPath.concat(`${path.sep}${projectName}`))) {
        projectPath = projectPath.concat(`${path.sep}${projectName}`);
    }

    const launchSettings = require(`${projectPath}${path.sep}Properties${path.sep}launchSettings.json`);
    const port = launchSettings.iisSettings.iisExpress.sslPort;
    const localhostUrl = 'https://localhost:' + port;

    const pages = fs.readdirSync(`${projectPath}${path.sep}Views${path.sep}Home`)
        .map(it => it.slice(0, it.indexOf('.')));

    let scenarios;

    //todo
    // _.remove(pages, isPageToIgnore);

    scenarios = pages.map(page => {
        return {
            'label': page,
            'url': `${localhostUrl}/${page}`,
            'delay': 500,
            'misMatchThreshold' : 0.1
        }
    });

    return scenarios;
}

exports.launchBackstop = function (commandToRun, projectName) {
    const projectConfig = require('./backstop.config.js')({
        'project': projectName,
        'scenarios': getScenariosForProject(projectsDirectoryPath, projectName)
    });

    if( commandToRun !== '' ) {
        backstop(commandToRun, { config: projectConfig });
    }
}
