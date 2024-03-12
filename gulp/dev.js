const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const { error } = require('console');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
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


gulp.task('html:dev', () => {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
})

gulp.task('sass:dev', () => {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
})

gulp.task('images:dev', () => {
    return gulp.src('./src/images/**/*')
        .pipe(changed('./build/images/'))
        // .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./build/images/'))
})

gulp.task('files:dev', () => {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'))
})

gulp.task('fonts:dev', () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
})

gulp.task('js:dev', () => {
    return gulp.src('./JS/**/*.js')
        .pipe(changed('./build/js'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(webpack(require('./../webpack.config')))
        .pipe(gulp.dest('./build/js'))
})

gulp.task('server:dev', () => {
    return gulp.src('./build/')
        .pipe(server({
            livereload: true,
            open: true
        }))
})

gulp.task('clean:dev', (done) => {
    if(fs.existsSync('./build/')){
        return gulp.src('./build/', {read: false})
        .pipe(clean({force: true}))
    }

    done()
})

gulp.task('watch:dev', () => {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'))
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'))
    gulp.watch('./src/images/**/*', gulp.parallel('images:dev'))
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'))
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'))
    gulp.watch('./src/js/**/*', gulp.parallel('js:dev'))
})
