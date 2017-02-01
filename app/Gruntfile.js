module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass'],
      },
      concat: {
        files: ['**/*.js'],
        tasks: ['concat'],
      },
      jshint: {
        files: ['**/*.js'],
        tasks: ['jshint'],
      },
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed'
      },
      dist: {
        files: {
          'styles/main.css': 'styles/main.scss'
        }
      },
    },
    jshint: {
      files: ['app.js', 'config/**/*.js', 'shared/**/*.js',  'Gruntfile.js'],
      options: {
        "esversion": 6,
      }
    },
    concat: {
      options: {
        // \n for new line
        separator: ';\n',
      },
      dist: {
        src: ['app.js', 'config/**/*.js', 'shared/**/*.js'],
        dest: 'dist/built.js',
      },
    },
  });

  // Load the Grunt plugin that provides the task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'concat', 'jshint', 'watch']);
};
