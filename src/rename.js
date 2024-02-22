import { MemoryFile } from './file.js';

export default async function* rename(files, target) {
    for await (let file of files) {
        file = await file.read();

        const path = typeof target === 'function' ? target(file.path, file) : target;

        yield new MemoryFile(path, file.buffer);
    }
}
