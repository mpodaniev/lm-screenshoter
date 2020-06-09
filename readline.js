const fs = require('fs');
const { AutoComplete, Select } = require('enquirer');
const {launchBackstop, projectsDirectoryPath, checkLocalHost} = require('./utils');

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
  try {
    const commandToRun = await select.run();
    const projectName = await autoComplete.run();
    const availableLocalHost = await checkLocalHost(projectName);
    if (availableLocalHost) {
      launchBackstop(commandToRun, projectName);
    } else {
      console.error('LocalHost is not available!');
    }
  } catch (e) {
    console.log(e);
  }
}

run();
