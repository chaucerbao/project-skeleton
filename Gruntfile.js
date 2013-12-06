module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* Variables */
    project: {
      sass: {
        src: 'sass',
        dest: 'dist/css'
      },
      js: {
        src: 'js',
        dest: 'dist/js'
      },
      img: {
        src: 'img',
        dest: 'dist/img'
      }
    },

    /* Global */
    watch: {
      sass: {
        files: ['<%= project.sass.src %>/**/*.{sass,scss}'],
        tasks: ['sass']
      },
      js: {
        files: ['<%= project.js.src %>/**/*.js'],
        tasks: ['jshint', 'uglify:dev']
      },
      img: {
        files: ['<%= project.img.src %>/**/*.{png,jpg,gif}'],
        tasks: ['imagemin']
      }
    },
    compress: {
      options: {
        mode: 'gzip'
      },
      css: {
        expand: true,
        cwd: '<%= project.sass.dest %>',
        src: ['**/*.css'],
        dest: '<%= project.sass.dest %>'
      },
      js: {
        expand: true,
        cwd: '<%= project.js.dest %>',
        src: ['**/*.js'],
        dest: '<%= project.js.dest %>'
      }
    },

    /* Styles */
    sass: {
      options: {
        require: ['bourbon', 'neat'],
        style: 'expanded'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.sass.src %>',
          src: ['**/*.{sass,scss}', '!**/_*.{sass,scss}'],
          dest: '<%= project.sass.dest %>',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      options: {
        report: 'min'
      },
      dist: {
        expand: true,
        cwd: '<%= project.sass.dest %>',
        src: ['**/*.css', '!**/*.min.css'],
        dest: '<%= project.sass.dest %>'
      }
    },

    /* Scripts */
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['<%= project.js.src %>']
    },
    uglify: {
      options: {
        report: 'min'
      },
      dev: {
        options: {
          beautify: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.js.src %>',
          src: '**/*.js',
          dest: '<%= project.js.dest %>'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.js.src %>',
          src: '**/*.js',
          dest: '<%= project.js.dest %>'
        }]
      }
    },

    /* Images */
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: '<%= project.img.src %>',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= project.img.dest %>'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('dist', ['sass', 'cssmin', 'jshint', 'uglify:dist', 'imagemin', 'compress']);
};
