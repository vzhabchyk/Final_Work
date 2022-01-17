const gulp = require('gulp');
const uglify = require('gulp-uglify');
const gulpConcat = require('gulp-concat');
const { series } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');

function concat() {
  return gulp.src(['./node_modules/lodash/lodash.js', './js/data.js', './js/app.js'])
    .pipe(gulpConcat('app.js'))
    .pipe(gulp.dest('./dist/'));
}

function minify() {
  return gulp.src('dist/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
}

function concatCss() {
  return gulp.src('./css/*.css')
    .pipe(gulpConcat('styles.css'))
    .pipe(gulp.dest('./dist/'));
}

function addPrefixes() {
  return gulp.src('dist/styles.css')
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist'))
}

function minifyCss() {
  return gulp.src('dist/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
}

function serve() {
  connect.server({
    fallback: 'index.html'
  });
}

exports.default = series(concat, minify, concatCss, addPrefixes, minifyCss, serve)