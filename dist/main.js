global.debug = (something) => {
    console.log(JSON.stringify(something))
}

global.log = debug

global.tc = require('task_controller')
global.helpers = require('helpers')
global.blueprintsHelper = require('helper.blueprints')
require('tasks')
require('memory_manager')

require('wrappers')

MemoryManager.init()

module.exports.loop = function () {
    require('task_processor').process()
    
    if (Game.time % 500 === 0) {
        MemoryManager.cleanUpTasks()
    }
    
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel()
    }
}