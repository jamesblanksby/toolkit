import path from 'path';
import url from 'url';

import { ESLint } from 'eslint';
import uglifyjs from 'uglify-js';

import { MemoryFile } from '../src/file.js';

const { PWD, } = process.env;

async function jsLint(files) {
    const configDir = path.dirname(url.fileURLToPath(import.meta.url));

    const eslint = new ESLint({
        cwd: PWD,
        overrideConfigFile: `${configDir}/../eslint.config.mjs`,
    });

    let results = [];

    for await (let file of files) {
        file = await file.read();

        const fileResult = await eslint.lintText(file.contents, { filePath: file.path, });
        results.push(...fileResult);
    }

    const formatter = await eslint.loadFormatter();
    const result = formatter.format(results);

    if (!result) {
        return;
    }

    console.log(result);
}

async function* jsMinify(files) {
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
    jsLint,
    jsMinify,
};
