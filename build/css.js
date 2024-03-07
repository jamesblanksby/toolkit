import cssnano from 'cssnano';
import postcss from 'postcss';
import presetenv from 'postcss-preset-env';

import { MemoryFile } from '../src/file.js';

const transformer = postcss(
    presetenv,
    cssnano,
);

export default async function cssBuild(file) {
    file = await file.read();

    const options = {
        from: file.path,
        map: true,
        to: file.path,
    };

    try {
        const result = await transformer.process(file.contents, options);
        return new MemoryFile(file.path, result.css);
    } catch (error) {
        throw error.message;
    }
}
