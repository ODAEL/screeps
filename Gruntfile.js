module.exports = function(grunt) {

    require('dotenv').config();

    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')

    grunt.initConfig({
        screeps: {
            options: {
                email: process.env.EMAIL,
                token: process.env.TOKEN,
                branch: process.env.BRANCH,
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        clean: {
            'dist': ['dist/*.js']
        },

        copy: {
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        return dest + src.replace(/\//g,'_');
                    },
                    // TODO Flatter requires
                    // options: {
                    //     process: function (content, srcpath) {
                    //         return content.replace(/require/g, srcpath);
                    //     },
                    // },
                }],
            }
        },
    })

    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps', 'clean']);
    grunt.registerTask('scopy',  ['copy:screeps']);
}