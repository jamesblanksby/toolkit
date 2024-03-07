import path from 'path';
import url from 'url';

import chalk from 'chalk';

import logEvents from './events.js';
import Toolkit from '../index.js';

const { PWD, } = process.env;

export default async function cli(args) {
    let tasks = [];
    const flags = new Map();

    for (const arg of args) {
        if (arg.startsWith('--')) {
            const [name, value,] = arg.substr(2).split('=', 2);
            flags.set(name, value || true);
        } else if (arg.startsWith('-')) {
            flags.set(arg.substr(1), true);
        } else {
            tasks.push(arg);
        }
    }

    if (flags.has('help') || flags.has('h')) {
        console.log();
        console.log(`Usage: ${chalk.yellow('$')} ${chalk.bold(path.basename(process.argv[1]))} ${chalk.blue('[tasks]')} ${chalk.grey('[options]')}`);
        console.log();
        console.log('Options:');
        console.log(`  --help, -h    ${chalk.grey('Show this help and exit.')}`);
        console.log(`  --config      ${chalk.grey('Manually set path of the config file.')}`);
        console.log(`  --tasks, -t   ${chalk.grey('Print the tasks from the loaded config and exit.')}`);
        console.log(`  --quiet       ${chalk.grey('Minimize logging.')}`);
        console.log(`  --silent      ${chalk.grey('Suppress all non-essential logging.')}`);
        console.log();

        process.exit();
    }

    tasks = tasks.length ? tasks : ['default',];

    const directory = path.dirname(url.fileURLToPath(import.meta.url));
    const config = flags.get('config') || `${directory}/../toolkit.config.js`;

    const toolkit = new Toolkit(flags);
    logEvents(toolkit);

    await toolkit.load(config);

    if (flags.has('tasks') || flags.has('t')) {
        console.log();
        console.log(`Tasks from: ${chalk.magenta.bold(path.relative(PWD, config))}:`);
        for (const name of toolkit.getTasks().keys()) {
            if (name !== 'default') {
                console.log(`  - ${name}`);
            }
        }
        console.log();

        process.exit();
    }

    if (!flags.has('silent')) {
        console.log();
        console.log(`Using config from: ${chalk.magenta.bold(path.relative(PWD, config))}`);
        console.log();
    }

    await toolkit.run(tasks);
}
