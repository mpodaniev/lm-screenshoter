const fs = require('fs');
const {AutoComplete, Select, Input} = require('enquirer');
const {launchBackstop, projectsDirectoryPath} = require('./utils');

const workflow = new Select({
  name: 'workflow',
  message: 'Choose workflow',
  choices: ['test', 'approve']
});

const env = new Select({
  name: 'env',
  message: 'Choose environment',
  choices: ['local', 'dev']
});

const projectUrl = new Input({
  message: 'Enter project url: ',
  initial: 'bad-credit-loans.co'
});

const autoCompleteFunc = function () {
  try {
    return new AutoComplete({
      name: 'projectName',
      message: 'Choose your project',
      limit: 10,
      initial: 2,
      choices: fs.readdirSync(projectsDirectoryPath)
    });
  } catch (e) {
    throw '\nERROR: You should set right directory path in parameter "projectsDirectoryPath" in "settings.json" file'
  }
}


async function run() {
  try {
    const commandToRun = await workflow.run();
    const environment = await env.run();
    let projectName = '';
    if (environment === 'dev') {
      projectName = await projectUrl.run();
    } else {
      projectName = await autoCompleteFunc().run();
    }

    launchBackstop(commandToRun, projectName, environment);
  } catch (e) {
    console.log(e);
  }
}

run();
