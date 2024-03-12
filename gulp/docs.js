const gulp = require('gulp');

//  HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean')
const webpHTML = require('gulp-webp-html');

//  SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const { error } = require('console');
const webpack = require('webpack-stream');

//  Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const changed = require('gulp-changed');
const { sassFalse } = require('sass');

const plumberNotify = (tittle) => {
    return {
        errorHandler: notify.onError({
            tittle: tittle,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}


gulp.task('html:docs', () => {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
})

gulp.task('sass:docs', () => {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'))
})

gulp.task('images:docs', () => {
    return gulp.src('./src/images/**/*')
        .pipe(changed('./docs/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/images/'))

        .pipe(gulp.src('./src/images/'))
        .pipe(changed('./docs/images/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/images/'))
})

gulp.task('files:docs', () => {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'))
})

gulp.task('fonts:docs', () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
})

gulp.task('js:docs', () => {
    return gulp.src('./JS/**/*.js')
        .pipe(changed('./docs/js'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(webpack(require('../webpack.config')))
        .pipe(gulp.dest('./docs/js'))
})

gulp.task('server:docs', () => {
    return gulp.src('./docs/')
        .pipe(server({
            livereload: true,
            open: true
        }))
})

gulp.task('clean:docs', (done) => {
    if(fs.existsSync('./docs/')){
        return gulp.src('./docs/', {read: false})
        .pipe(clean({force: true}))
    }

    done()
})
