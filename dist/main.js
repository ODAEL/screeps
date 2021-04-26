require('globals')
const {RoomConfig} = require("./rooms_config");
const {MemoryManager} = require("./memory_manager");
const {TaskProcessor} = require("./task_processor");

MemoryManager.init()

global.hmm = () => {
    let creepRoleData = (new RoomConfig('E33N38')).creepRoleData('some')
}

module.exports.loop = function () {
    TaskProcessor.process()
    
    if (Game.time % 500 === 0) {
        MemoryManager.cleanUp()
    }
    
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel()
    }
}
