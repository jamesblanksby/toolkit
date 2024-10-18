import path from 'path';

import uglifyjs from 'uglify-js';

import { MemoryFile } from './../index.js';

const { PWD, } = process.env;

function flattenAsset(file, type) {
    const name = path.relative(PWD, file.path)
        .replace(new RegExp(`src/${type}/?`), '')
        .replace(new RegExp('/', 'g'), '_');

    return new MemoryFile(name, file.buffer);
}

function flattenCss(file) {
    if (!file.path.endsWith('.css')) {
        return flattenAsset(file, 'css');
    }

    const name = `${path.basename(file.path)}.liquid`;

    const result = file.contents
        .replace(new RegExp('../(font|gfx)/', 'g'), '')
        .replace(new RegExp('url\\((.*?)\\)', 'g'), (_, match) => {
            const resource = match.replace(new RegExp('/', 'g'), '_');
            return `url({{ '${resource}' | asset_url }})`;
        });

    return new MemoryFile(name, result);
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

        if (file.path.includes('/css/')) {
            file = flattenCss(file);
        } else if (file.path.includes('/font/')) {
            file = flattenAsset(file, 'font');
        } else if (file.path.includes('/gfx/')) {
            file = flattenAsset(file, 'gfx');
        } else if (file.path.includes('/script/')) {
            file = flattenScript(file);
        } else {
            file = new MemoryFile(path.basename(file.path), file.contents);
        }

        yield file;
    }
}
