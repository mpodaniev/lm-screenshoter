const fs = require('fs');
const {AutoComplete, Select, Input} = require('enquirer');
const {launchBackstopLocal, launchBackstopDev, projectsDirectoryPath, checkLocalHost} = require('./utils');

const workflow = new Select({
  name: 'workflow',
  message: 'Choose workflow',
  choices: ['test', 'approve']
});

const env = new Select({
  name: 'workflow',
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
    if (environment === 'dev') {
      const projectName = await projectUrl.run();
      launchBackstopDev(commandToRun, projectName);
    } else {
      const projectName = await autoCompleteProject.run();
      const availableLocalHost = await checkLocalHost(projectName);
      if (availableLocalHost) {
        launchBackstopLocal(commandToRun, projectName);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

run();
