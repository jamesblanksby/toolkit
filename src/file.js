import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';

export default class File {
    #path;

    constructor(path) {
        this.#path = path;
    }

    get path() {
        return this.#path;
    }

    get name() {
        return path.basename(this.#path);
    }

    read() {
        throw new Error('Not implemented');
    }
}

class MemoryFile extends File {
    #buffer;

    constructor(path, contents) {
        super(path);

        this.#buffer = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
    }

    get buffer() {
        return this.#buffer;
    }

    get contents() {
        return this.#buffer.toString();
    }

    async read() {
        return this;
    }
}

class DiskFile extends File {
    async read() {
        const contents = await fs.readFile(this.path);
        return new MemoryFile(this.path, contents);
    }
}

export {
    MemoryFile,
    DiskFile,
};
