import browsersync from 'browser-sync';

import browserReload from './build/browser.js';
import cssTransform from './build/css.js';
import sassCompile from './build/sass.js';
import { scriptLint, scriptMinify } from './build/script.js';
import shopifyFlatten from './build/shopify.js';

import { parallel, series, src, watch } from './index.js';

const { PWD, } = process.env;

const pattern = {
    html: `${PWD}/**/*.{html,php}`,
    sass: `${PWD}/**/{sass,scss}/**/*.{sass,scss}`,
    css: `${PWD}/**/css/**/*.css`,
    script: `${PWD}/**/script/**/*.js`,
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
    return files.pipe(sassCompile)
        .dest();
}

function css(files) {
    return files.pipe(cssTransform)
        .dest();
}

function reload(files) {
    return files.pipe(browserReload);
}

function observe() {
    watch(pattern.html, reload);
    watch(pattern.sass, series(sass, css));
    watch(pattern.css, reload);
    watch(pattern.script, reload);
}

function lint() {
    return src(pattern.script, { ignore: ['**.min.js',], })
        .pipe(scriptLint);
}

function minify() {
    return src(pattern.script, { ignore: ['**.min.js',], })
        .pipe(scriptMinify)
        .dest();
}

async function shopify() {
    const shopifyDir = `${PWD}/../shopify/assets`;
    const assetDir = process.env.ASSET_DIR || PWD;

    await src(`${shopifyDir}/**`).rm().toArray();

    return src(`${assetDir}/**/(css|font|gfx|plugin|script)/**`, { ignore: '**/node_modules/**', })
        .pipe(shopifyFlatten)
        .dest(shopifyDir);
}

const dev = parallel(sync, observe);
export default dev;

export {
    dev,
    lint,
    minify,
    shopify,
};
