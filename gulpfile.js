'use strict';

// Plugins
let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    pug = require('gulp-pug'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    replace = require('gulp-replace'),
    livereload = require('gulp-livereload');


// DEV ############################################################################################
// create folder ----------------------------------------------------------------------------------
gulp.task('folder-dev', function Watcher() {
    return gulp.src('src/')
    .pipe(gulp.dest('demo'))
})


// template ---------------------------------------------------------------------------------------
gulp.task('pug', function Template() {
    return gulp.src([
        'src/html/index.pug',
        'src/html/pages/*.pug'
    ])
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('demo/'))
    .pipe(livereload({ start: true }));
})


// style ------------------------------------------------------------------------------------------
gulp.task('scss', function styleDemo() {
    return gulp.src([
        'src/scss/normalize.scss',
        'src/scss/base.scss',
        'src/scss/theme.scss',
        'src/scss/layouts.scss',
        'src/scss/modules.scss',
        'src/scss/pages.scss',
        'src/scss/demo.scss'
    ])
    .pipe(plumber())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(concatCss('demo.min.css'))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(cleanCSS())
    .pipe(gulp.dest('demo/assets/css'))
    .pipe(livereload({ start: true }));
});

gulp.task('scss-vendor', function styleVendor() {
    return gulp.src('src/scss/vendor.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(concatCss('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('demo/assets/css'))
    .pipe(livereload({ start: true }));
});


// javascript -------------------------------------------------------------------------------------
gulp.task('scripts', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'src/js/demo.js',
            'src/js/console.js',
            'src/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('demo.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('demo/assets/js'))
    .pipe(livereload({ start: true }));
});


// images -----------------------------------------------------------------------------------------
gulp.task('images-dev', function () {
    return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest('demo/images'));
});

// fonts ------------------------------------------------------------------------------------------
gulp.task('fonts-dev', function () {
    return gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('demo/assets/fonts'));
});


// watcher ----------------------------------------------------------------------------------------
gulp.task('watcher', function Watcher() {
    livereload.listen();
    gulp.watch('src/html/**/*.pug', gulp.series('pug'));
    gulp.watch('src/scss/**/*.scss', gulp.series('scss', 'scss-vendor'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('src/images/**/*.*', gulp.series('images-dev'));
});

// PRODUCTION #####################################################################################
// create folder ----------------------------------------------------------------------------------
gulp.task('folder-prod', function Watcher() {
    return gulp.src('src/')
    .pipe(gulp.dest('public'))
})


// template ---------------------------------------------------------------------------------------
gulp.task('pug-prod', function buildHTML() {
    return gulp.src([
        'src/html/index.pug',
        'src/html/pages/*.pug'
    ])
    .pipe(plumber())
    .pipe(replace('include ../blocks/head-demo.pug','include ../blocks/head-prod.pug'))
    .pipe(replace('include ../blocks/scripts-demo.pug','include ../blocks/scripts-prod.pug'))
    .pipe(pug({
        pretty: '    '
    }))
    .pipe(gulp.dest('public/'))
});


// style ------------------------------------------------------------------------------------------
gulp.task('scss-prod', function styleDemo() {
    return gulp.src([
        'src/scss/normalize.scss',
        'src/scss/fonts.scss',
        'src/scss/base.scss',
        'src/scss/typography.scss',
        'src/scss/layouts.scss',
        'src/scss/modules.scss',
        'src/scss/pages.scss',
        'src/scss/demo.scss'
    ])
    .pipe(plumber())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('scss-vendor-prod', function styleVendor() {
    return gulp.src('src/scss/vendor.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(concatCss('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/assets/css'));
});


// javascript -------------------------------------------------------------------------------------
gulp.task('js-prod-minify', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'src/js/demo.js',
            'src/js/console.js',
            'src/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
});

gulp.task('js-prod-vendor', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
});

gulp.task('js-prod', function () {
    return gulp.src([
            'src/js/console.js',
            'src/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('public/assets/js'))
});

// images -----------------------------------------------------------------------------------------
gulp.task('images-prod', function () {
    return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest('public/images'));
});

// fonts ------------------------------------------------------------------------------------------
gulp.task('fonts-prod', function () {
    return gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('public/assets/fonts'));
});

// COMMANDS #######################################################################################
gulp.task('dev', gulp.series(
    'folder-dev',
    'pug',
    'scss',
    'scss-vendor',
    'scripts',
    'images-dev',
    'fonts-dev',
    'watcher'
));

gulp.task('build', gulp.series(
    'folder-prod',
    'pug-prod',
    'scss-prod',
    'scss-vendor-prod',
    'js-prod-minify',
    'js-prod-vendor',
    'js-prod',
    'fonts-prod',
    'images-prod'
));
