const settings = require('./settings.json');
const args = require('yargs').argv;
const launchBackstop = require('./utils').launchBackstop;


let projectName = '';
if (args.project || args.p) {
    projectName = args.p ? args.p : args.project;
} else {
    console.error('You need to pass project name in argument "--project"')
}

let commandToRun = '';
if (args.test || args.t) {
    commandToRun = 'test';
} else if ((args.approve || args.a)) {
    commandToRun = 'approve';
} else {
    console.error('You need to use argument "--test" or "--approve"');
}

launchBackstop(commandToRun, projectName, settings.projectsDirectoryPath);
