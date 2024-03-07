import Files from './files.js';

const names = new Map();

export default class Task {
    #handler;
    #promise = null;

    constructor(handler, name) {
        if (name) {
            names.set(handler, name);
        }

        this.#handler = handler;
    }

    get name() {
        return names.get(this.#handler) || this.#handler.name || '<anonymous>';
    }

    async #run(scope, input) {
        scope.emit('start', { task: this.name, date: new Date(), });

        const handler = typeof this.#handler === 'function' ? this.#handler.call(scope, input) : this.#handler;

        try {
            const result = new Files(handler).toArray();

            scope.emit('stop', { task: this.name, date: new Date(), });

            return result;
        } catch (error) {
            scope.emit('error', { task: this.name, date: new Date(), error: error, });

            return;
        }
    }

    run(scope, input) {
        if (input) {
            return this.#run(scope, input);
        }

        if (!this.#promise) {
            this.#promise = this.#run(scope, input);
        }

        return this.#promise;
    }
}

function validateTasks(tasks) {
    return tasks.map((task) => {
        if (typeof task === 'function') {
            task = new Task(task);
        }

        if (!(task instanceof Task)) {
            return;
        }

        return task;
    });
}

function series(...tasks) {
    tasks = validateTasks(tasks);
    return async function(input) {
        for (const task of tasks) {
            input = await task.run(this, input);
        }
        return input;
    };
}

function parallel(...tasks) {
    tasks = validateTasks(tasks);
    return async function(input) {
        return Promise.all(tasks.map((task) => task.run(this, input)));
    };
}

export {
    series,
    parallel,
};
