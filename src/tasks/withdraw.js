const {Task} = require("./task");

module.exports.TaskWithdraw = class TaskWithdraw extends Task {
    constructor(creep, target) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_WITHDRAW)

        this.targetId = target && target.id
    }

    run() {
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

        if (target.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
