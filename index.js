const backstop = require('backstopjs');
const fs = require('fs');
const args = require('yargs').argv;
const projectsDirectoryPath = 'C:\\LM';
const path = require('path');


let projectName = '';
if (args.project || args.p) {
    projectName = args.p ? args.p : args.project;
} else {
    console.error('You need to pass project name in argument "--project"')
}


let projectPath = `${projectsDirectoryPath}${path.sep}${projectName}`;

if (fs.existsSync(projectPath.concat(`${path.sep}${projectName}`))) {
    projectPath = projectPath.concat(`${path.sep}${projectName}`);
}

const launchSettings = require(`${projectPath}${path.sep}Properties${path.sep}launchSettings.json`);
const port = launchSettings.iisSettings.iisExpress.sslPort;
const localhostUrl = 'https://localhost:' + port;

const projectConfig = require('./backstop.config.js')({
    'project': projectName,
    'scenarios': getScenariosForProject(projectPath)
});


let commandToRun = '';

if (args.test || args.t) {
    commandToRun = 'test';
} else if ((args.approve || args.a)) {
    commandToRun = 'approve';
} else {
    console.error('You need to use argument "--test" or "--approve"');
}

if( '' !== commandToRun ) {
    backstop(commandToRun, { config: projectConfig });
}

function getScenariosForProject(projectPath) {
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
