import chalk from 'chalk';

function log(date, message) {
    const timestamp = date.toLocaleTimeString(undefined, { hour12: false, });

    console.log(`[${chalk.grey(`${timestamp}`)}] ${message}`);
}

export default function logEvents(scope) {
    const loggedErrors = [];

    scope.on('start', function(event) {
        if (!(scope.hasFlag('quiet') || scope.hasFlag('silent'))) {
            log(event.date, `${chalk.green('Starting')} '${chalk.cyan(event.task)}'`);
        }
    });

    scope.on('stop', function(event) {
        if (!(scope.hasFlag('quiet') || scope.hasFlag('silent'))) {
            log(event.date, `${chalk.yellow('Finished')} '${chalk.cyan(event.task)}'`);
        }
    });

    scope.on('error', function(event) {
        log(event.date, `${chalk.red('Error in')} '${chalk.cyan(event.task)}'`);

        if (loggedErrors.indexOf(event.error) === -1) {
            log(event.date, event.error);
            loggedErrors.push(event.error);
        }
    });

    scope.on('notfound', function(event) {
        if (!scope.hasFlag('silent')) {
            log(event.date, chalk.red(`Task '${event.task}' not found in loaded config`));
        }
    });
}
