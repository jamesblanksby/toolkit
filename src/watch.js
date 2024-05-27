import chokidar from 'chokidar';

import Tookit from './../index.js';

import src from './src.js';
import { parallel } from './task.js';

export default async function watch(pattern, tasks) {
    if (!Array.isArray(tasks)) {
        tasks = [tasks,];
    }

    const { scope, } = Tookit;
    const run = parallel(...tasks).bind(scope);

    const watcher = chokidar.watch(pattern);

    const callback = async (path) => {
        const files = src(path);

        await run(files);
    };

    watcher.on('change', callback);
}
