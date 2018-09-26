const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('js', () => {
  return gulp.src('./resources/assets/js/app.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('../public/assets/js'));
});

gulp.task('sass', function () {
  return gulp.src('./resources/assets/scss/app.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('../public/assets/css'));
});

gulp.task('watch', function(){
  gulp.watch('./resources/assets/js/**/*', gulp.parallel('js'));
  gulp.watch('./resources/assets/scss/**/*', gulp.parallel('sass'));
});

gulp.task('default', gulp.parallel('watch'));