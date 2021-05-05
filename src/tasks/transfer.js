const {Task} = require("./task");

module.exports.TaskTransfer = class TaskTransfer extends Task {
    constructor(target, data) {
        super(TASK_TYPE_TRANSFER)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        const resourceType = this.data.resourceType || RESOURCE_ENERGY

        if (creep.store.getUsedCapacity(resourceType) === 0) {
            return false
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            Log.error('Unable to find target by id=' + this.targetId)

            return false
        }

        if (target.store && target.store.getFreeCapacity(resourceType) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.transfer(target, resourceType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        if (creep.store.getUsedCapacity(resourceType) > 0) {
            return false
        }

        creep.say('Done!')

        return false
    }
};
