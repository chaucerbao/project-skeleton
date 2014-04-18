'use strict';

/* Source and destination paths */
var paths = {
  css: { src: './src/css/', dest: './public/css/' },
  js: { src: './src/js/', dest: './public/js/' },
  img: { src: './src/img/', dest: './public/img/' },
  html: { src: './src/html/', dest: './public/' }
};

/* Files */
var files = {
  css: { src: [paths.css.src + '**/*.{sass,scss,less}', '!' + paths.css.src + '**/_*.{sass,scss,less}'] },
  js: { src: [paths.js.src + '**/*.js'], dest: 'script.js' },
  img: { src: [paths.img.src + '**/*.{png,jpg,gif}'] },
  html: { src: [paths.html.src + '**/*.jade'] }
};

/* Plugins */
var gulp = require('gulp'),
  newer = require('gulp-newer'),
  gzip = require('gulp-gzip'),
  clean = require('gulp-clean'),
  less = require('gulp-less'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  jade = require('gulp-jade'),
  htmlmin = require('gulp-htmlmin');

/* Tasks */
gulp.task('watch', ['build'], function() {
  gulp.watch(files.css.src[0], ['css']);
  gulp.watch(files.js.src, ['js']);
  gulp.watch(files.img.src, ['img']);
  gulp.watch(files.html.src, ['html']);
});

gulp.task('compress', function() {
  gulp.src(paths.css.dest + '/**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest(paths.css.dest));
  gulp.src(paths.js.dest + '/**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest(paths.js.dest));
  gulp.src(paths.html.dest + '/**/*.html')
    .pipe(gzip())
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('clean', function() {
  gulp.src([paths.css.dest, paths.js.dest, paths.img.dest, paths.html.dest])
    .pipe(clean());
});

gulp.task('css', function() {
  gulp.src(files.css.src, { base: paths.css.src })
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('js', function() {
  gulp.src(files.js.src, { base: paths.js.src })
    .pipe(newer(paths.js.dest + files.js.dest))
    .pipe(concat(files.js.dest))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('img', function() {
  gulp.src(files.img.src, { base: paths.img.src })
    .pipe(newer(paths.img.dest))
    .pipe(imagemin({ progressive: true, optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.img.dest));
});

gulp.task('html', function() {
  gulp.src(files.html.src, { base: paths.html.src })
    .pipe(newer({ dest: paths.html.dest, ext: '.html' }))
    .pipe(jade({ pretty: true }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('build', ['css', 'js', 'img', 'html']);
gulp.task('dist', ['clean', 'build', 'compress']);
gulp.task('default', ['watch']);
