const {RoomWrapper} = require("../wrappers");
const {Helpers} = require("../helpers");
const {Task} = require("./task");

module.exports.TaskSpawnCreep = class TaskSpawnCreep extends Task {
    constructor(data) {
        super(TASK_TYPE_SPAWN_CREEP)

        this.data = data || {}
    }

    run(spawn) {
        const roomWrapper = new RoomWrapper(Game.getObjectById(this.subjectId).room);

        let memory = {
            role: this.data.role || 'default',
            automated: (this.data.automated !== undefined) ? this.data.automated : true,
            tasks: (this.data.initialTasks !== undefined) ? this.data.initialTasks : [],
        }

        let optimalBodyparts = this.data.optimalBodyparts || [WORK, CARRY, MOVE];
        let energy = roomWrapper.myCreeps().length === 0 ? roomWrapper.energyAvailable() : roomWrapper.energyCapacityAvailable()
        let bodyparts = Helpers.chooseBodyparts(energy, optimalBodyparts);

        let name = 'Creep ' + Game.time + '_' + _.random(1000, 9999)

        if (spawn.spawnCreep(bodyparts, name, {memory: memory}) === OK) {
            return false
        }

        return true
    }
};
