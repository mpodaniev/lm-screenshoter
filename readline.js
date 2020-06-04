const projectsDirectoryPath = 'C:\\LM';

const backstop = require('backstopjs');
const fs = require('fs');
const { AutoComplete, Select } = require('enquirer');
const getScenariosForProject = require('./util.js').getScenariosForProject;

const select = new Select({
    name: 'workflow',
    message: 'Choose workflow',
    choices: ['test', 'approve']
});

const autoComplete = new AutoComplete({
    name: 'projectName',
    message: 'Choose your project',
    limit: 10,
    initial: 2,
    choices: fs.readdirSync(projectsDirectoryPath)
});

let params = {};

async function run() {
    params.commandToRun = await select.run();
    params.projectName = await autoComplete.run();
    launchBackstop();
}

function launchBackstop() {
    const projectConfig = require('./backstop.config.js')({
        'project': params.projectName,
        'scenarios': getScenariosForProject(projectsDirectoryPath, params.projectName)
    });

    if( '' !== params.commandToRun ) {
        backstop(params.commandToRun, { config: projectConfig });
    }
}

run();