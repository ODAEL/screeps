require('./globals')
require('./prototypes/prototypes')
require('./custom/commands')

const {MemoryManager} = require("./memory_manager");
const {TaskProcessor} = require("./tasks/processors/processor");
const cron = require('./custom/cron')

module.exports.loop = function () {
    cron()

    TaskProcessor.process()
    
    if (Game.time % 200 === 0) {
        MemoryManager.cleanUp()
    }
    
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel()
    }
}
