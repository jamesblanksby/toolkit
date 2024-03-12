import { ESLint } from 'eslint';
import uglifyjs from 'uglify-js';

import { MemoryFile } from '../src/file.js';

async function scriptLint(files) {
    const eslint = new ESLint();

    let results = [];

    for await (let file of files) {
        file = await file.read();

        const fileResult = await eslint.lintText(file.contents, { filePath: file.path, });
        results = results.concat(fileResult);
    }

    const formatter = await eslint.loadFormatter();
    const result = formatter.format(results);

    console.log(result);
}

async function* scriptMinify(files) {
    for await (let file of files) {
        file = await file.read();

        const result = uglifyjs.minify(file.contents);

        if (result.error) {
            throw result.error;
        }

        const minifiedPath = file.path.replace(/.js$/, '.min.js');

        yield new MemoryFile(minifiedPath, result.code);
    }
}

export {
    scriptLint,
    scriptMinify,
};
