import browsersync from 'browser-sync';

import cssBuild from './build/css.js';
import sassBuild from './build/sass.js';
import scriptMinify from './build/script.js';

import { parallel, series, src, watch } from './index.js';

const { PWD, } = process.env;

const pattern = {
    html: `${PWD}/**/*.{html,php}`,
    sass: `${PWD}/**/{sass,scss}/**/*.{sass,scss}`,
    css: `${PWD}/**/css/*.css`,
    script: `${PWD}/**/script/*.js`,
};

function sync() {
    browsersync.init({
        ghostMode: false,
        logLevel: 'silent',
        notify: false,
        open: false,
        proxy: 'http://127.0.0.1',
        snippet: false,
        ui: false,
    });
}

function sass(files) {
    return files.pipe(async function*(files) {
        for await (const file of files) {
            yield sassBuild(file);
        }
    }).dest();
}

function css(files) {
    return files.pipe(async function*(files) {
        for await (const file of files) {
            yield cssBuild(file);
        }
    }).dest();
}

function reload(files) {
    return files.pipe(async function*(files) {
        for await (const file of files) {
            browsersync.reload(file.path);
        }
    });
}

function observe() {
    watch(pattern.html, reload);
    watch(pattern.sass, series(sass, css));
    watch(pattern.css, reload);
    watch(pattern.script, reload);
}

function minify() {
    return src(pattern.script, { ignore: ['**.min.js',], }).pipe(async function*(files) {
        for await (const file of files) {
            yield scriptMinify(file);
        }
    }).dest();
}

const dev = parallel(sync, observe);
export default dev;

export {
    dev,
    minify,
};
