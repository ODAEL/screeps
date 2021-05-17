const {Task} = require("./task");

module.exports.TaskTransfer = class TaskTransfer extends Task {
    constructor(target, data) {
        super(TASK_TYPE_TRANSFER)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const resourceType = this.data.resourceType || RESOURCE_ENERGY

        if (creep.store.getUsedCapacity(resourceType) === 0) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            Log.error('Unable to find target by id=' + this.targetId)

            return this.skip()
        }

        if (target.store && target.store.getFreeCapacity(resourceType) === 0) {
            return this.skip()
        }

        creep.say(this.type)

        let result = creep.transfer(target, resourceType)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
