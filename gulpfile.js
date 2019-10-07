'use strict';

// Plugins
let gulp = require('gulp'),
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
    .pipe(livereload({ start: true }));
});


// Build
gulp.task('build', gulp.series('html-build'));


// Default
gulp.task('default', function () {
    livereload.listen();

    gulp.watch('__dev/templates/**/*.pug', gulp.series('html-demo'));
});
