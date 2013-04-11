module.exports = (grunt) ->

  grunt.initConfig 
    pkg: grunt.file.readJSON('package.json'),
    uglify:
      options:
        banner: '/*! http://github.com/raganwald/<%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> (c) 2012-2013 Reg Braithwaite MIT Licensed */\n'
      build:
        src: 'lib/<%= pkg.name %>.js',
        dest: 'lib/<%= pkg.name %>.min.js'

  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['uglify'])