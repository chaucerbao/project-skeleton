'use strict';

/* Source and destination paths */
var paths = {
  css: { src: './src/css/', dest: './public/css/' },
  js: { src: './src/js/', dest: './public/js/' },
  img: { src: './src/img/', dest: './public/img/' }
};

/* Files */
var files = {
  css: { src: paths.css.src + '**/*.styl' },
  js: { src: paths.js.src + '**/*.js' },
  img: { src: paths.img.src + '**/*.{png,jpg,gif}' }
};

/* Plugins */
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  del = require('del'),
  rename = require('gulp-rename'),
  newer = require('gulp-newer'),
  gzip = require('gulp-zopfli'),

  /* CSS */
  stylus = require('gulp-stylus'),
  postcss = require('gulp-postcss'),
  postcssProcessors = [require('autoprefixer-core')],
  minifyCSS = require('gulp-minify-css'),

  /* Javascript */
  browserify = require('browserify'),
  transform = require('vinyl-transform'),
  uglify = require('gulp-uglify'),

  /* Images */
  imagemin = require('gulp-imagemin');

/* Tasks */
gulp.task('watch', ['build'], function() {
  gulp.watch(files.css.src, ['css']);
  gulp.watch(files.js.src, ['js']);
  gulp.watch(files.img.src, ['img']);
});

gulp.task('compress', function() {
  gulp.src(paths.css.dest + '**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest(paths.css.dest));
  gulp.src(paths.js.dest + '**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('clean', function() {
  del([paths.css.dest, paths.js.dest, paths.img.dest]);
});

gulp.task('css', function() {
  gulp.src(paths.css.src + '*.styl', { base: paths.css.src })
    .pipe(plumber({ errorHandler: notify.onError({ title: 'CSS Error', message: '<%= error.message %>' }) }))
    .pipe(stylus({ 'include css': true }))
    .pipe(postcss(postcssProcessors))
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(notify({ title: 'CSS Compiled', message: 'Success', onLast: true }));
});

gulp.task('js', function() {
  var browserified = transform(function(file) {
    return browserify(file).bundle();
  });

  gulp.src(paths.js.src + '*.js', { base: paths.js.src })
    .pipe(plumber({ errorHandler: notify.onError({ title: 'Javascript Error', message: '<%= error.message %>' }) }))
    .pipe(browserified)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(notify({ title: 'Javascript Compiled', message: 'Success', onLast: true }));
});

gulp.task('img', function() {
  gulp.src(files.img.src, { base: paths.img.src })
    .pipe(plumber({ errorHandler: notify.onError({ title: 'Images Error', message: '<%= error.message %>' }) }))
    .pipe(newer(paths.img.dest))
    .pipe(imagemin({ progressive: true, optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.img.dest))
    .pipe(notify({ title: 'Images Compiled', message: 'Success', onLast: true }));
});

gulp.task('build', ['css', 'js', 'img']);
gulp.task('default', ['watch']);
