const {Task} = require("./task");

module.exports.TaskDismantle = class TaskDismantle extends Task {
    constructor(structure) {
        super(TASK_TYPE_DISMANTLE)

        this.structureId = structure && structure.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.finish()
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.finish()
        }

        const structure = Game.getObjectById(this.structureId);
        if (!structure) {
            Log.error('Unable to find target by id=' + this.structureId)

            return this.finish()
        }

        if (!(structure instanceof Structure)) {
            Log.error('Found object is not structure ' + structure)

            return this.finish()
        }

        creep.say(this.type)

        if (creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return false
    }
};
