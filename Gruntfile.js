module.exports = function(grunt) {

    require('dotenv').config();

    grunt.loadNpmTasks('grunt-screeps');

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
        }
    });
}