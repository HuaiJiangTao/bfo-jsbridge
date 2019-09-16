'use strict';

module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        clean: ['build'],
        uglify: {
            options: {
                banner: '/* Build Time: <%= grunt.template.today("yyyy-mm-dd H:MM:ss") %> */'
            },
            jsbridge: {
                files: {
                    'dist/jsbridge.js': ['src/index.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['clean', 'uglify']);
}
