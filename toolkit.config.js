import browsersync from 'browser-sync';

import cssBuild from './build/css.js';
import sassBuild from './build/sass.js';
import scriptMinify from './build/script.js';

import { series, src, watch } from './index.js';

const { PWD, } = process.env;

const pattern = {
    html: `${PWD}/**/*.{html,php}`,
    sass: `${PWD}/**/{sass,scss}/**/*.{sass,scss}`,
    css: `${PWD}/**/css/*.css`,
    script: `${PWD}/**/script/*.js`,
};

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

function sync(files) {
    return files.pipe(async function*(files) {
        for await (const file of files) {
            browsersync.reload(file.path);
        }
    });
}

function minify() {
    return src(pattern.script, { ignore: ['**.min.js',], }).pipe(async function*(files) {
        for await (const file of files) {
            yield scriptMinify(file);
        }
    }).dest();
}

export default function dev() {
    browsersync.init({
        ghostMode: false,
        logLevel: 'silent',
        notify: false,
        open: false,
        proxy: 'http://127.0.0.1',
        snippet: false,
        ui: false,
    });

    watch(pattern.html, sync);
    watch(pattern.sass, series(sass, css));
    watch(pattern.css, sync);
    watch(pattern.script, sync);
}

export {
    dev,
    minify,
};
