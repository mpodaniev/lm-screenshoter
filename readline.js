const projectsDirectoryPath = 'C:\\LM';

const fs = require('fs');
const { AutoComplete, Select } = require('enquirer');
const launchBackstop = require('./utils').launchBackstop;

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

async function run() {
    const commandToRun = await select.run();
    const projectName = await autoComplete.run();
    launchBackstop(commandToRun, projectName, projectsDirectoryPath);
}

run();