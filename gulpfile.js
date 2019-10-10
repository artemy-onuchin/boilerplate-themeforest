'use strict';

// Plugins
let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    pug = require('gulp-pug'),
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

// Build
gulp.task('build', gulp.series('html-build','css-build'));


// Default
gulp.task('default', function () {
    livereload.listen();

    gulp.watch('__dev/templates/**/*.pug', gulp.series('html-demo'));

    gulp.watch('__dev/scss/**/*.scss', gulp.series('demo-style'));
});
