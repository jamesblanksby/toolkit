import fs from 'fs/promises';
import path from 'path';

export default async function rm(files) {
    const rmEmptyParents = async (filepath) => {
        const parent = path.dirname(filepath);
        if (!parent) {
            return;
        }

        let entries = [];
        try {
            entries = await fs.readdir(parent);
        } catch (error) {
            return;
        }

        if (!entries.length) {
            await fs.rmdir(parent);
            await rmEmptyParents(parent);
        }
    };

    for await (const file of files) {
        await fs.rm(file.path, { force: true, });
        await rmEmptyParents(file.path);
    }
}
