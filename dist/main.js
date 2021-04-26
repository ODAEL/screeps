const {MemoryManager} = require("./memory_manager");

require('globals')
require('tasks')

MemoryManager.init()

module.exports.loop = function () {
    require('task_processor').process()
    
    if (Game.time % 500 === 0) {
        MemoryManager.cleanUp()
    }
    
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel()
    }
}
