const {Task} = require("./task");

module.exports.TaskWithdraw = class TaskWithdraw extends Task {
    constructor(target, data) {
        super(TASK_TYPE_WITHDRAW)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        const resourceType = this.data.resourceType || RESOURCE_ENERGY

        if (creep.store.getFreeCapacity(resourceType) === 0) {
            return false
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return false
        }

        if (!(target instanceof Structure) && !(target instanceof Tombstone) && !(target instanceof Ruin)) {
            Log.error('Found target is not structure or tombstone or ruin ' + target)

            return false
        }

        if (!target.store) {
            Log.error('Found target has no store ' + target)

            return false
        }

        if (target.store.getUsedCapacity(resourceType) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.withdraw(target, resourceType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
