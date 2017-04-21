module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
       dist: ['dist/'],
       scripts: ['src/**/js/scripts.js']
    },
    browserify: {
      dist: {
        expand: true,
        cwd: 'src/',
        src: ['**/js/scripts.js'],
        dest: 'dist/',
        ext: '.min.js'
      }
    },
    mkdir: {
      all: {
        options: {
          create: ['tmp', 'media']
        }
      }
    },
    chmod: {
      options: {
        mode: '777'
      },
      media: {
        src: ['tmp', 'media']
      }
    },
    watch: {
        css: {
            files: ['src/**/css/*'],
            tasks: ['copy:css'],
            options: {
                livereload: true
            }
        },
        js: {
            files: ['src/**/js/*'],
            tasks: ['clean:scripts', 'custom-concat', 'browserify:dist', 'uglify:scripts'],
            options: {
                livereload: true
            }
        },
        index: {
            files: ['src/**/index.html'],
            tasks: ['copy:index'],
            options: {
                livereload: true
            }
        },
        images: {
            files: ['src/**/img/*'],
            tasks: ['copy:images'],
            options: {
                livereload: true
            }
        }
    },
    copy: {
      index: {
        expand: true,
        cwd: 'src/',
        src: ['**/index.html'],
        dest: 'dist/'
      },
      favicon: {
        expand: true,
        cwd: 'src/',
        src: ['**/favicon.ico'],
        dest: 'dist/'
      },
      css: {
        expand: true,
        cwd: 'src/',
        src: ['**/css/**'],
        dest: 'dist/'
      },
      images: {
        expand: true,
        cwd: 'src/',
        src: ['**/img/**'],
        dest: 'dist/'
      }
    },
    uglify: {
      scripts: {
          options: {
              sourceMap: true
          },
          files: [{
              expand: true,
              cwd: 'src',
              src: ['**/js/scripts.js'],
              dest: 'dist/',
              ext: '.min.js'
          }]
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', '', function() {
    var taskList = [
        'clean',
        'mkdir',
        'chmod',
        'copy',
        'custom-concat',
        'browserify',
        //'uglify',
        'concurrent'
    ];
    grunt.task.run(taskList);
  });


  grunt.registerTask("custom-concat", "concat files", function() {
    // read all subdirectories from your modules folder
    grunt.file.expand("src/*").forEach(function (dir) {
      //var dir = dir.split('/')[1];
      // get the current concat config
      var concat = grunt.config.get('concat') || {};

      // set the config for this modulename-directory
      concat[dir] = {
       src: [dir + '/js/*.js'],
       dest: dir + '/js/scripts.js'
      };

      // save the new concat configuration
      grunt.config.set('concat', concat);
    });
    console.log("Created scripts");
    // when finished run the concatinations
    grunt.task.run('concat');
  });

};