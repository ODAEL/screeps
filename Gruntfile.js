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
                        return dest + src.replace(/\//g,'.');
                    },
                }],
                options: {
                    // Kill me please, I am a shitcoder
                    process: function (content, srcpath) {
                        let requiresIterator = content.matchAll(/require\(.*\)/g)

                        let requires = []
                        for (let piece of requiresIterator) {
                            requires.push(piece.toString())
                        }

                        let files = []
                        for (let req of requires) {
                            let file = req
                                .replace("require(", '')
                                .replace(")", '')
                                .replaceAll('"', '')
                                .replaceAll('\'', '')
                                .replaceAll('./', '')
                            files.push(file)
                        }

                        let pathArray = srcpath.split('/')
                        pathArray.splice(0, 1)
                        pathArray.splice(pathArray.length - 1, 1)

                        let newFiles = []
                        for (let file of files) {
                            let specificPathArray = [...pathArray]

                            while (file !== file.replace('.', '')) {
                                specificPathArray.splice(specificPathArray.length - 1, 1)
                                file = file.replace('.', '')
                            }

                            let newFile = ''
                            if (specificPathArray.length !== 0) {
                                newFile += specificPathArray.join('/') + '/'
                            }
                            newFile += file
                            newFiles.push(newFile)
                        }

                        let newRequires = []
                        for (let newFile of newFiles) {
                            newRequires.push("require('./" + newFile.replaceAll('/', '.') + "')")
                        }

                        for (let i = 0; i < requires.length; i++) {
                            content = content.replace(requires[i], newRequires[i])
                        }

                        return content
                    },
                },
            }
        },
    })

    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps', 'clean']);
    grunt.registerTask('scopy',  ['clean', 'copy:screeps']);
}