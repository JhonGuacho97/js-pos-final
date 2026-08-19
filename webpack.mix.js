const mix = require('laravel-mix');
const del = require('del');

class CleanBuildChunksPlugin {
    apply(compiler) {
        const cleanChunks = () => {
            del.sync(['public/js/chunks/**/*']);
        };

        compiler.hooks.beforeRun.tap('CleanBuildChunksPlugin', cleanChunks);
        compiler.hooks.watchRun.tap('CleanBuildChunksPlugin', cleanChunks);
    }
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.options({
    postCss: [
        require('autoprefixer'),
    ],
});

mix.setPublicPath('public');
mix.webpackConfig({
    plugins: [new CleanBuildChunksPlugin()],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': __dirname + 'resources'
        }
    },
    output: {
        chunkFilename: 'js/chunks/[name].[contenthash:8].js',
    },
    watchOptions: {
        poll: 1000,
    },
}).react();

mix.js('resources/js/app.js', 'public/js');

mix.js('resources/pos/src/index.js', 'public/js/app.js').version();
mix.copyDirectory('resources/images',
    'public/images')
