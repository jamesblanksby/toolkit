import chalk from 'chalk';

function log(date, message) {
    const timestamp = date.toLocaleTimeString(undefined, { hour12: false, });

    console.log(`[${chalk.grey(`${timestamp}`)}] ${message}`);
}

export default function logEvents(scope) {
    const loggedErrors = [];

    if (!(scope.hasFlag('quiet') || scope.hasFlag('silent'))) {
        scope.on('start', function(event) {
            log(event.date, `Starting '${chalk.cyan(event.task)}'`);
        });

        scope.on('stop', function(event) {
            log(event.date, `Finished '${chalk.cyan(event.task)}'`);
        });
    }

    scope.on('error', function(event) {
        log(event.date, chalk.red(`'${chalk.cyan(event.task)}' errored`));

        if (loggedErrors.indexOf(event.error) === -1) {
            log(chalk.red(event.error));
            loggedErrors.push(event.error);
        }
    });

    if (!scope.hasFlag('silent')) {
        scope.on('notfound', function(event) {
            log(event.date, chalk.red(`Task '${event.task}' not found in loaded config`));
        });
    }
}
