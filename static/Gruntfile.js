module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    staticSrc: 'src/',
    staticOutput: 'output/',
    tmpFolder: 'tmp/',

    clean: {
      option: {
        force: true
      },
      tmp: ['<%= tmpFolder %>']

    },
    concat: {
      static_js: {
        options: {
          separator: ';'
        },
        files: [
          {
            src: ['<%= staticSrc %>js/*.js'],
            dest: '<%= staticOutput %>js/app.js'
          },
          {
            src: ['<%= staticSrc %>vendor/scripts/**/*.js'],
            dest: '<%= staticOutput %>js/vendor.js'
          }
        ]
      },
      static_css: {
        files: [
          {
            src: [
              '<%= staticSrc %>vendor/styles/**/*.css',
              '<%= tmpFolder %>less.css'
            ],
            dest: '<%= staticOutput %>css/app.css'
          }
        ]
      }
    },
    connect: {
      static_connect_watch: {
        options: {
          port: 3333,
          hostname: '0.0.0.0',
          livereload: 1337,
          base: '<%= staticOutput %>'
        }
      },
      static_connect_wait: {
        options: {
          port: 3333,
          base: '<%= staticOutput %>',
          keepalive: true
        }
      }
    },
    copy: {
      // Copy fonts and images;
      static_copy: {
        files: [
          {
            expand: true,
            cwd: '<%= staticSrc %>',
            src: ['{fonts,images}/**'],
            dest: '<%= staticOutput %>'
          }
        ]
      }
    },
    csslint: {
      static_csslint: {
        src: ['<%= staticSrc %>css/**/*.css']
      }
    },
    cssmin: {
      static_cssmin: {
        files: [
          {
            expand: true,
            cwd: '<%= staticOutput %>',
            src: ['css/*.css'],
            dest: '<%= staticOutput %>',
            ext: '.css'
          }
        ]
      }
    },
    jade: {
      static_jade: {
        options: {
          debug: false,
          pretty: true,
          client: false
        },
        files: [
          {
            expand: true,
            cwd: '<%= staticSrc %>',
            src: ['*.jade'],
            dest: '<%= staticOutput %>',
            ext: '.html'
          }
        ]
      }
    },
    jshint: {
      static_jshint: {
        options: {
          laxbreak: true,
          globals: {
            jQuery: true
          }
        },
        src: ['<%= staticSrc %>js/**/*.js']
      }
    },
    less: {
      static_less: {
        options: {
          compress: false,
          cleancss: false
        },
        files: [
          {
            src: [
              '<%= staticSrc %>less/*.less',
              '!<%= staticSrc %>less/_*.less',  // exclude dashed files;
              '<%= staticSrc %>css/*.css'       // include user css;
            ],
            dest: '<%= tmpFolder %>less.css' // place in temp for autoprefixer;
          }
        ]
      }

    },
    uglify: {
      static_uglify: {
        options: {
          report: 'min',
          sourceMap: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= staticOutput %>',
            src: ['js/*.js'],
            dest: '<%= staticOutput %>',
            ext: '.js'
          }
        ]
      }

    },

    // Watching for all changes in source folder;
    watch: {
      static_watch: {
        options: {
          debounceDelay: 2E3,
          livereload: 1337
        },
        files: ['<%= staticSrc %>**'],
        tasks: ['compileStatic']
      }
    }

  });


  // Compile static;
  grunt.registerTask('compileStatic', [
    'jade:static_jade',
    'less:static_less',
    'concat:static_css',
    'concat:static_js',
    'copy:static_copy',
    'clean:tmp'
  ]);

  // Prepare minified static version;
  grunt.registerTask('minifyStatic', [
    'htmlmin:static_htmlmin',
    'cssmin:static_cssmin',
    'uglify:static_uglify'
  ]);

  // Check static code quality;
  grunt.registerTask('verifyStatic', [
    'csslint:static_csslint',
    'jshint:static_jshint'
  ]);

  // Compile and run server;
  grunt.registerTask('static', [
    'compileStatic',
    'connect:static_connect_watch',
    'watch:static_watch'
  ]);

};
