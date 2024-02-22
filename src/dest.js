import fs from 'fs/promises';
import path from 'path';

import { DiskFile } from './file.js';

export default async function* dest(files, directory) {
    for await (let file of files) {
        file = await file.read();

        const targetPath = typeof directory == 'undefined' ? file.path : path.join(directory, file.path);
        const targetDir = path.dirname(targetPath);

        await fs.mkdir(targetDir, { recursive: true, });

        await fs.writeFile(targetPath, file.buffer);
        yield new DiskFile(targetPath);
    }
}
