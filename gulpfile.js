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
    livereload = require('gulp-livereload');


// Templates (HTML)
gulp.task('html-demo', function buildHTML() {
    return gulp.src('__dev/templates/*.pug')
    .pipe(plumber())
    .pipe(pug({}))
    .pipe(gulp.dest('demo/'))
    .pipe(livereload({ start: true }));
});

gulp.task('html-build', function buildHTML() {
    return gulp.src('__dev/templates/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty: '    ',
    }))
    .pipe(gulp.dest('public/'))
});


// Style
gulp.task('demo-style', function styleDemo() {
    return gulp.src([
            '__dev/scss/normalize.scss',
            '__dev/scss/fonts.scss',
            '__dev/scss/base.scss',
            '__dev/scss/typography.scss',
            '__dev/scss/layouts.scss',
            '__dev/scss/modules.scss',
            '__dev/scss/pages.scss'
        ])
    .pipe(plumber())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(concatCss('style.min.css'))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(cleanCSS())
    .pipe(gulp.dest('demo/assets/css'))
    .pipe(livereload({ start: true }));
});

// Style
gulp.task('css-build', function styleDemo() {
    return gulp.src([
            '__dev/scss/normalize.scss',
            '__dev/scss/fonts.scss',
            '__dev/scss/base.scss',
            '__dev/scss/typography.scss',
            '__dev/scss/layouts.scss',
            '__dev/scss/modules.scss',
            '__dev/scss/pages.scss'
        ])
    .pipe(plumber())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gcmq())
    // .pipe(cleanCSS({
    //     format: 'beautify'
    // }))
    .pipe(gulp.dest('public/assets/css'))
});


// JavaScript
gulp.task('demo-js', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            '__dev/js/console.js',
            '__dev/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('demo.js'))
    .pipe(uglify())
    .pipe(gulp.dest('demo/assets/js'))
    .pipe(livereload({ start: true }));
});

gulp.task('js-vendor', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            '__dev/js/console.js',
            '__dev/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(livereload({ start: true }));
});

gulp.task('js-minify', function () {
    return gulp.src([
            '__dev/js/console.js',
            '__dev/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(livereload({ start: true }));
});

gulp.task('js', function () {
    return gulp.src([
            '__dev/js/console.js',
            '__dev/js/common.js'
        ])
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(livereload({ start: true }));
});


// Build
gulp.task('build', gulp.series('html-build','css-build', 'js-vendor', 'js-minify', 'js'));


// Default
gulp.task('default', function () {
    livereload.listen();

    gulp.watch('__dev/templates/**/*.pug', gulp.series('html-demo'));

    gulp.watch('__dev/scss/**/*.scss', gulp.series('demo-style'));

    gulp.watch('__dev/js/**/*.js', gulp.series('demo-js'));
});
