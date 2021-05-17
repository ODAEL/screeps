const {Task} = require("./task");

module.exports.TaskDismantle = class TaskDismantle extends Task {
    constructor(structure) {
        super(TASK_TYPE_DISMANTLE)

        this.structureId = structure && structure.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            cl(1)
            return this.skip()
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            cl(2)
            return this.skip()
        }

        const structure = Game.getObjectById(this.structureId);
        if (!structure) {
            cl(3)
            Log.error('Unable to find target by id=' + this.structureId)

            return this.skip()
        }

        if (!(structure instanceof Structure)) {
            cl(4)
            Log.error('Found object is not structure ' + structure)

            return this.skip()
        }

        creep.say(this.type)

        let result = creep.dismantle(structure)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
