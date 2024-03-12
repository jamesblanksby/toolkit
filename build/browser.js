import browsersync from 'browser-sync';

export default async function browserReload(files) {
    for await (const file of files) {
        browsersync.reload(file.path);
    }
}
