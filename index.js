const projectsDirectoryPath = 'C:\\LM';

const backstop = require('backstopjs');
const args = require('yargs').argv;
const getScenariosForProject = require('./util.js').getScenariosForProject;


let projectName = '';
if (args.project || args.p) {
    projectName = args.p ? args.p : args.project;
} else {
    console.error('You need to pass project name in argument "--project"')
}

const projectConfig = require('./backstop.config.js')({
    'project': projectName,
    'scenarios': getScenariosForProject(projectsDirectoryPath, projectName)
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
