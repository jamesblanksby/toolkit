import fs from 'fs/promises';
import path from 'path';
import url from 'url';

import * as sass from 'sass';

import { MemoryFile } from './../src/file.js';

async function findMainPaths(source) {
    const partialDir = path.dirname(source);

    async function findMainPathsRec(directory, matches = []) {
        const files = await fs.readdir(directory);

        const matchedFiles = files.filter((file) => !file.startsWith('_') && file.endsWith('.scss'));
        const fullPaths = matchedFiles.map((file) => path.join(directory, file));

        matches.push(...fullPaths);

        const parentDir = path.dirname(directory);
        if (parentDir !== directory) {
            return findMainPathsRec(parentDir, matches);
        }

        return matches;
    }

    return findMainPathsRec(partialDir);
}

async function createCssAndMapFile(css, map, source) {
    const cssPath = source.replace(/sass|scss/g, 'css');
    const mapPath = `${cssPath}.map`;
    const mapName = path.basename(mapPath);

    const file = new MemoryFile(cssPath, [
        css,
        `/*# sourceMappingURL=${mapName} */`,
    ].join('\n'));

    const sassDir = path.resolve(source, './../..');
    map.sources = map.sources.map((source) => source.replace(`file://${sassDir}`, '..'));

    await fs.writeFile(mapPath, JSON.stringify(map));

    return file;
}

export default async function* sassCompile(files) {
    const modulesDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), './../../..');

    const options = {
        loadPaths: [modulesDir,],
        sourceMap: true,
    };

    for await (const file of files) {
        const sassPaths = await findMainPaths(file.path);

        for (const sassPath of sassPaths) {
            let result;
            try {
                result = sass.compile(sassPath, options);
            } catch (error) {
                throw new Error(error.message);
            }

            yield await createCssAndMapFile(result.css, result.sourceMap, sassPath);
        }
    }
}
