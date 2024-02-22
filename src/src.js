import fastglob from 'fast-glob';
import { minimatch } from 'minimatch';

import { DiskFile } from './file.js';
import Files from './files.js';
import { unique } from './helper.js';

async function* src(patterns, options = {}) {
    const positive = [];
    const negative = [];

    if (!Array.isArray(patterns)) {
        patterns = [patterns,];
    }

    for (let pattern of patterns) {
        pattern = pattern.trim();

        if (pattern.startsWith('!') && !pattern.startsWith('!(')) {
            negative.push(pattern.substr(1));
        }
        else {
            positive.push(pattern);
        }
    }

    for await (const path of unique(positive.map((glob) => fastglob(glob, options)))) {
        const isNegativeMatch = negative.some((glob) => minimatch(path, glob, options));
        if (!isNegativeMatch) {
            yield new DiskFile(path);
        }
    }
}

export default function(...args) {
    return new Files(src(...args));
}
