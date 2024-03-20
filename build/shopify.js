import path from 'path';

import uglifyjs from 'uglify-js';

import { MemoryFile } from './../index.js';

const { PWD, } = process.env;

function flattenCss(file) {
    const name = `${path.basename(file.path)}.liquid`;

    const result = file.contents
        .replace(/\.\.\/(font|gfx)\//g, '')
        .replace(/url\((.*?)\)/g, (_, match) => {
            const resource = match.replace(/\//g, '_');
            return `url({{ '${resource}' | asset_url }})`;
        });

    return new MemoryFile(name, result);
}

function flattenGfx(file) {
    const name = path.relative(PWD, file.path)
        .replace(/^src\/gfx\/?/, '')
        .replace(/\//g, '_');

    return new MemoryFile(name, file.contents);
}

function flattenScript(file) {
    const result = uglifyjs.minify(file.contents);

    if (result.error) {
        throw result.error;
    }

    return new MemoryFile(path.basename(file.path), result.code);
}

export default async function* shopifyFlatten(files) {
    for await (let file of files) {
        file = await file.read();

        if (file.path.includes('/css/') && file.path.split('.').pop() === 'css') {
            file = flattenCss(file);
        } else if (file.path.includes('/gfx/')) {
            file = flattenGfx(file);
        } else if (file.path.includes('/script/')) {
            file = flattenScript(file);
        } else {
            file = new MemoryFile(path.basename(file.path), file.contents);
        }

        yield file;
    }
}
