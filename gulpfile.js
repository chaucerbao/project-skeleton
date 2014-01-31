'use strict';

/* Variables */
var project = {
  sass: {
    src: ['sass/**/*.{sass,scss}', '!sass/**/_*.{sass,scss}'],
    dest: 'dist/css',
    required: ['bourbon', 'neat']
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
  sass = require('gulp-ruby-sass'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin');

/* Tasks */
gulp.task('watch', ['sass', 'uglify'], function() {
  gulp.watch(project.sass.src[0], ['sass']);
  gulp.watch(project.js.src, ['uglify']);
});

gulp.task('gzip', function() {
  gulp.src(project.sass.dest + '/**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest(project.sass.dest));
  gulp.src(project.js.dest + '/**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('sass', function() {
  gulp.src(project.sass.src)
    .pipe(sass({
      require: project.sass.required,
      style: 'compressed'
    }))
    .pipe(gulp.dest(project.sass.dest));
});

gulp.task('uglify', function() {
  gulp.src(project.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('imagemin', function() {
  gulp.src(project.img.src)
    .pipe(imagemin())
    .pipe(gulp.dest(project.img.dest));
});

gulp.task('dist', ['sass', 'uglify', 'imagemin', 'gzip']);
gulp.task('default', ['watch']);
