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

const autoCompleteProject = new AutoComplete({
  name: 'projectName',
  message: 'Choose your project',
  limit: 10,
  initial: 2,
  choices: fs.readdirSync(projectsDirectoryPath)
});

async function run() {
  try {
    const commandToRun = await workflow.run();
    const environment = await env.run();
    let projectName = '';
    if (environment === 'dev') {
      projectName = await projectUrl.run();
    } else {
      projectName = await autoCompleteProject.run();
    }

    launchBackstop(commandToRun, projectName, environment);
  } catch (e) {
    console.log(e);
  }
}

run();
