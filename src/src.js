import fastglob from 'fast-glob';

import { DiskFile } from './file.js';
import Files from './files.js';
import { unique } from './helper.js';

async function* src(patterns, options = {}) {
    if (!Array.isArray(patterns)) {
        patterns = [patterns,];
    }

    for await (const path of unique(patterns.map((glob) => fastglob(glob, options)))) {
        yield new DiskFile(path);
    }
}

export default function(...args) {
    return new Files(src(...args));
}
