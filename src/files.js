import dest from './dest.js';
import { flatten } from './helper.js';
import rename from './rename.js';
import rm from './rm.js';

export default class Files {
    #iterable;

    constructor(...iterable) {
        this.#iterable = iterable;
    }

    async*[Symbol.asyncIterator]() {
        const iterable = flatten(this.#iterable);
        for await (const file of iterable) {
            yield file;
        }
    }

    async toArray() {
        const files = [];
        for await (const file of this) {
            files.push(file);
        }
        return new Files(files);
    }

    pipe(handler, ...args) {
        return new Files(handler(this, ...args));
    }

    dest(...args) {
        return this.pipe(dest, ...args);
    }

    rename(...args) {
        return this.pipe(rename, ...args);
    }

    rm(...args) {
        return this.pipe(rm, ...args);
    }

    async run() {
        for await (const file of this) {
            void file;
        }
    }
}
