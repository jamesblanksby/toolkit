import EventEmitter from 'events';
import path from 'path';
import process from 'process';
import url from 'url';

import { DiskFile, MemoryFile } from './src/file.js';
import Files from './src/files.js';
import src from './src/src.js';
import Task, { parallel, series } from './src/task.js';
import watch from './src/watch.js';

let scope = null;

export default class Toolkit extends EventEmitter {
    #flags;
    #config;
    #tasks;

    constructor(flags) {
        super();
        this.#flags = flags;
    }

    async load(config) {
        this.#config = path.resolve(config);
        this.#tasks = new Map();

        const module = await import(url.pathToFileURL(this.#config).href);

        for (const name of Object.keys(module)) {
            if (typeof module[name] === 'function') {
                this.#tasks.set(name, new Task(module[name], name));
            }
        }
    }

    async run(tasks) {
        scope = this;

        process.chdir(path.dirname(this.#config));

        const getTask = (name) => {
            const task = this.#tasks.get(name);
            if (!task) {
                process.exit(1);
            }

            return task;
        };

        for (const task of tasks.map(getTask)) {
            await task.run(this);
        }
    }

    hasFlag(name) {
        return this.#flags.has(name);
    }

    getFlag(name) {
        return this.#flags.get(name);
    }

    getTasks() {
        return this.#tasks;
    }

    static get scope() {
        return scope;
    }
}

export {
    DiskFile,
    Files,
    MemoryFile,
    parallel,
    series,
    src,
    watch,
};
