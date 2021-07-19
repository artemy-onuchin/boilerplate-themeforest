'use strict'

// Plugins
let gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
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
    del = require('del'),
    sync = require('browser-sync')

// ##################################################################################################################################
// DEVELOPMENT MODE BELOW ###########################################################################################################
// ##################################################################################################################################

// Cleaning demo folder -------------------------------------------------------------------------------------------------------------
gulp.task('cleaning-dev', function CleaningDevFolder() {
    return del('demo')
})

// Create folder --------------------------------------------------------------------------------------------------------------------
gulp.task('create-dev-folder', function CreateDevFolder() {
    return gulp.src('src/')
        .pipe(gulp.dest('demo'))
})

// Local server ---------------------------------------------------------------------------------------------------------------------
gulp.task('serve', function LocalServer() {
    sync.init({
        server: {
            baseDir: './demo',
        },
        open: false,
        notify: false
    })

    gulp.watch('src/html/**/*.pug', gulp.series('pug-dev')).on('change', sync.reload)
    gulp.watch('src/scss/**/*.scss', gulp.series('sass-dev', 'sass-vendor-dev')).on('change', sync.reload)
    gulp.watch('src/images/**/*.*', gulp.series('images-dev')).on('change', sync.reload)
})

// Template -------------------------------------------------------------------------------------------------------------------------
gulp.task('pug-dev', function TemplateDev() {
    return gulp.src([
        'src/html/index.pug',
        'src/html/pages/*.pug'
    ])
        .pipe(plumber())
        .pipe(pug({}))
        .pipe(gulp.dest('demo/'))
})

// Styles ---------------------------------------------------------------------------------------------------------------------------
gulp.task('sass-dev', function StyleDev() {
    return gulp.src([
        'src/scss/normalize.scss',
        'src/scss/base.scss',
        'src/scss/fonts.scss',
        'src/scss/theme.scss',
        'src/scss/layouts.scss',
        'src/scss/components.scss',
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
})

gulp.task('sass-vendor-dev', function StyleVendorDev() {
    return gulp.src('src/scss/vendor.scss')
        .pipe(plumber())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(concatCss('vendor.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('demo/assets/css'))
})

// JavaScripts ----------------------------------------------------------------------------------------------------------------------
gulp.task('scripts-dev', function ScriptsDev() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/demo.js',
        'src/js/console.js',
    ])
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat('demo.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('demo/assets/js'))
})

// Fonts ----------------------------------------------------------------------------------------------------------------------------
gulp.task('fonts-dev', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('demo/assets/fonts'))
})

// Images ---------------------------------------------------------------------------------------------------------------------------
gulp.task('images-dev', function () {
    return gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('demo/images'))
})

// ##################################################################################################################################
// PRODUCTION MODE BELOW ############################################################################################################
// ##################################################################################################################################

// Create folder --------------------------------------------------------------------------------------------------------------------
gulp.task('create-prod-folder', function CreateDevFolder() {
    return gulp.src('src/')
        .pipe(gulp.dest('product'))
})

// Template -------------------------------------------------------------------------------------------------------------------------
gulp.task('pug-product', function TemplateDev() {
    return gulp.src([
        'src/html/index.pug',
        'src/html/pages/*.pug'
    ])
        .pipe(plumber())
        .pipe(replace('include ../common/head-demo.pug','include ../common/head-prod.pug'))
        .pipe(replace('include ../common/scripts-demo.pug','include ../common/scripts-prod.pug'))
        .pipe(pug({
            pretty: '    '
        }))
        .pipe(gulp.dest('product/'))
})

// Styles ---------------------------------------------------------------------------------------------------------------------------
gulp.task('sass-prod', function StyleDev() {
    return gulp.src([
        'src/scss/normalize.scss',
        'src/scss/base.scss',
        'src/scss/fonts.scss',
        'src/scss/theme.scss',
        'src/scss/layouts.scss',
        'src/scss/components.scss',
        'src/scss/pages.scss',
        'src/scss/demo.scss'
    ])
        .pipe(plumber())
        .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gcmq())
        .pipe(gulp.dest('product/assets/css'))
})

gulp.task('sass-vendor-prod', function StyleVendorDev() {
    return gulp.src('src/scss/vendor.scss')
        .pipe(plumber())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(concatCss('vendor.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('product/assets/css'))
})

// JavaScripts ----------------------------------------------------------------------------------------------------------------------
gulp.task('scripts-prod', function ScriptsDev() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/demo.js',
        'src/js/console.js',
    ])
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest('product/assets/js'))
})

// Fonts ----------------------------------------------------------------------------------------------------------------------------
gulp.task('fonts-prod', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('product/assets/fonts'))
})

// Images ---------------------------------------------------------------------------------------------------------------------------
gulp.task('images-prod', function () {
    return gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('product/images'))
})


// ##################################################################################################################################
// GULP COMMANDS BELOW ##############################################################################################################
// ##################################################################################################################################
gulp.task('dev', gulp.series(
    'cleaning-dev',
    'create-dev-folder',
    'pug-dev',
    'sass-vendor-dev',
    'sass-dev',
    'scripts-dev',
    'fonts-dev',
    'images-dev',
    'serve'
))

gulp.task('build', gulp.series(
    'create-prod-folder',
    'fonts-prod',
    'images-prod',
    'sass-prod',
    'sass-vendor-prod',
    'pug-product',
    'scripts-prod'
))
