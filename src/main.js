require('globals')
require('commands')
const {MemoryManager} = require("./memory_manager");
const {TaskProcessor} = require("./task_processor");

MemoryManager.init()

module.exports.loop = function () {
    TaskProcessor.process()
    
    if (Game.time % 500 === 0) {
        MemoryManager.cleanUp()
    }
    
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel()
    }
}
