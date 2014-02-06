'use strict';

/* Variables */
var project = {
  css: {
    src: {
      base: './css/',
      files: ['./css/**/*.{sass,scss}', '!./css/**/_*.{sass,scss}']
    },
    dest: './public/css/'
  },
  js: {
    src: {
      base: './js/',
      files: ['./js/vendor/**/*.js', './js/**/*.js']
    },
    dest: './public/js/',
    filename: 'script.js'
  },
  img: {
    src: {
      base: './img/',
      files: ['./img/**/*.{png,jpg,gif}']
    },
    dest: './public/img/'
  }
};

/* Dependencies */
var gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  clean = require('gulp-clean'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin');

/* Tasks */
gulp.task('watch', ['css', 'js'], function() {
  gulp.watch(project.css.src.files[0], ['css']);
  gulp.watch(project.js.src.files, ['js']);
});

gulp.task('compress', function() {
  gulp.src(project.css.dest + '/**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest(project.css.dest));
  gulp.src(project.js.dest + '/**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('clean', function() {
  gulp.src([project.css.dest + '/**/*.gz', project.js.dest + '/**/*.gz'])
    .pipe(clean());
});

gulp.task('css', function() {
  gulp.src(project.css.src.files, { base: project.css.src.base })
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(project.css.dest));
});

gulp.task('js', function() {
  gulp.src(project.js.src.files, { base: project.js.src.base })
    .pipe(concat(project.js.filename))
    .pipe(uglify())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('img', function() {
  gulp.src(project.img.src.files, { base: project.img.src.base })
    .pipe(imagemin())
    .pipe(gulp.dest(project.img.dest));
});

gulp.task('build', ['css', 'js', 'img']);
gulp.task('dist', ['build', 'compress']);
gulp.task('default', ['watch']);
