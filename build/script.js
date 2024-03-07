import uglifyjs from 'uglify-js';

import { MemoryFile } from '../src/file.js';

export default async function scriptMinify(file) {
    file = await file.read();

    const result = uglifyjs.minify(file.contents);

    if (result.error) {
        throw result.error;
    }

    const minifiedPath = file.path.replace(/.js$/, '.min.js');

    return new MemoryFile(minifiedPath, result.code);
}
