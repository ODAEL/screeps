const {Task} = require("./task");

module.exports.TaskWithdraw = class TaskWithdraw extends Task {
    constructor(target, data) {
        super(TASK_TYPE_WITHDRAW)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const resourceType = this.data.resourceType || RESOURCE_ENERGY

        if (creep.store.getFreeCapacity(resourceType) === 0) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return this.skip()
        }

        if (!(target instanceof Structure) && !(target instanceof Tombstone) && !(target instanceof Ruin)) {
            Log.error('Found target is not structure or tombstone or ruin ' + target)

            return this.skip()
        }

        if (!target.store) {
            Log.error('Found target has no store ' + target)

            return this.skip()
        }

        if (target.store.getUsedCapacity(resourceType) === 0) {
            return this.skip()
        }

        creep.say(this.type)

        if (creep.withdraw(target, resourceType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
