const {Task} = require("./task");

module.exports.TaskWithdraw = class TaskWithdraw extends Task {
    constructor(creep, target, data) {
        super(creep && creep.id, TASK_TYPE_WITHDRAW)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run() {
        const resourceType = this.data.resourceType || RESOURCE_ENERGY
        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return false
        }

        if (!(target instanceof Structure) && !(target instanceof Tombstone)) {
            log('Found target is not structure or tombstone ' + target)

            return false
        }

        if (!target.store) {
            log('Found target has no store ' + target)

            return false
        }

        if (target.store.getUsedCapacity(resourceType) === 0) {
            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getFreeCapacity(resourceType) === 0) {
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
