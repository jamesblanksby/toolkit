import fs from 'fs/promises';
import path from 'path';

import * as sass from 'sass';

import { MemoryFile } from '../src/file.js';

let sassPath = null;

async function findMainPath(partialPath) {
    const partialDir = path.dirname(partialPath);

    async function findMainPathRec(directory) {
        const files = await fs.readdir(directory);

        const mainPath = files.find((file) => !file.startsWith('_') && file.endsWith('.scss'));
        if (mainPath) {
            return path.join(directory, mainPath);
        }

        const parentDir = path.dirname(directory);
        if (parentDir !== directory) {
            return findMainPathRec(parentDir);
        }

        return null;
    }

    return findMainPathRec(partialDir);
}

function createCssFile(css, target) {
    return new MemoryFile(target, css);
}

async function createMapFile(map, target) {
    const sassDir = path.resolve(sassPath, '../..');

    map.sources = map.sources.map((source) => source.replace(`file://${sassDir}`, '..'));

    await fs.writeFile(target, JSON.stringify(map));
}

async function createCssFileWithMap(file, source) {
    const mapName = path.basename(source);

    file = await file.read();

    file = new MemoryFile(file.path, [
        file.contents,
        `/*# sourceMappingURL=${mapName} */`,
    ].join('\n'));

    return file;
}

export default async function sassBuild(file) {
    sassPath = await findMainPath(file.path);

    let result;
    try {
        result = sass.compile(sassPath, { sourceMap: true, });
    } catch (error) {
        throw error.message;
    }

    const cssPath = sassPath.replace(/sass|scss/g, 'css');
    let cssFile = createCssFile(result.css, cssPath);

    const mapPath = `${cssPath}.map`;
    await createMapFile(result.sourceMap, mapPath);

    cssFile = await createCssFileWithMap(cssFile, mapPath);

    return cssFile;
}
