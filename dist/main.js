require('constants')
require('globals')

Memory.tasks = Memory.tasks || []

module.exports.loop = function () {
    require('task_manager').process()
    
    if (Game.time % 500 == 0) {
        require('memory').cleanUpTasks()
    }
    
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel()
    }
}