const backstop = require('backstopjs');
const fs = require('fs');
const args = require('yargs').argv;
const projectsDirectoryPath = 'C:\\LM';
const path = require('path');


let projectName = '';
if (args.p || args.project) {
    projectName = args.p ? args.p : args.project;
} else {
    console.error('You need to pass project name in argument "--project"')
}

const projectPath = `${projectsDirectoryPath}${path.sep}${projectName}`;
const localhost = 'https://localhost:' + JSON.parse(fs.readFileSync(`${projectPath}${path.sep}${projectName}${path.sep}Properties${path.sep}launchSettings.json`, 'utf8'))
    .iisSettings.iisExpress.sslPort;

const projectConfig = require('./backstop.config.js')({
    "project": projectName,
    "scenarios": getScenariosForProject(projectPath)
});


let commandToRun = '';

if (args.test || args.t) {
    commandToRun = "test";
} else if ((args.approve || args.a)) {
    commandToRun = "approve";
} else {
    console.error('You need to use argument "--test" or "--approve"');
}

if( "" !== commandToRun ) {
    backstop(commandToRun, { config: projectConfig });
}

function getScenariosForProject(projectPath) {
    const files = fs.readdirSync(`${projectPath}\\${projectName}\\Views\\Home`)
        .map(it => it.slice(0, it.indexOf('.')));

    let scenarios;

    //todo
    // _.remove(files, isFileToIgnore);

    scenarios = files.map(file => {
        const scenarioLabel = file.split(".")[0].split("-").join(" ");

        return {
            "label": scenarioLabel,
            "url": `${localhost}/${file}`,
            "delay": 500,
            "misMatchThreshold" : 0.1
        }
    });

    return scenarios;
}