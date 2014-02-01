'use strict';

/* Variables */
var project = {
  css: {
    src: ['sass/**/*.{sass,scss}', '!sass/**/_*.{sass,scss}'],
    dest: 'dist/css'
  },
  js: {
    src: 'js/**/*.js',
    dest: 'dist/js'
  },
  img: {
    src: 'img/**/*.{png,jpg,gif}',
    dest: 'dist/img'
  }
};

/* Dependencies */
var gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  sass = require('gulp-sass'),
  minifyCSS = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin');

/* Tasks */
gulp.task('watch', ['css', 'js'], function() {
  gulp.watch(project.css.src[0], ['css']);
  gulp.watch(project.js.src, ['js']);
});

gulp.task('compress', function() {
  gulp.src(project.css.dest + '/**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest(project.css.dest));
  gulp.src(project.js.dest + '/**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('css', function() {
  gulp.src(project.css.src)
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest(project.css.dest));
});

gulp.task('js', function() {
  gulp.src(project.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('img', function() {
  gulp.src(project.img.src)
    .pipe(imagemin())
    .pipe(gulp.dest(project.img.dest));
});

gulp.task('dist', ['css', 'js', 'img', 'compress']);
gulp.task('default', ['watch']);
