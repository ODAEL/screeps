const {Task} = require("./task");

module.exports.TaskHarvest = class TaskHarvest extends Task {
    constructor(target) {
        super(TASK_TYPE_HARVEST)

        this.targetId = target && target.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        let workBodyparts = creep.getActiveBodyparts(WORK)

        if (creep.store.getFreeCapacity() < workBodyparts * 2) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return this.skip()
        }

        if (!(target instanceof Source) && !(target instanceof Mineral)) {
            Log.error('Fount target is not source or mineral ' + target)

            return this.skip()
        }

        creep.say(this.type)

        const harvestResult = creep.harvest(target);
        if (harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 4});
            return this.continue()
        }
        if (harvestResult === ERR_NOT_ENOUGH_RESOURCES) {
            return this.skip()
        }

        if (target instanceof Mineral && harvestResult === ERR_TIRED) {
            // Log.error('Wait')

            return this.continue()
        }

        if (harvestResult !== OK) {
            Log.error('Error while harvest ' + harvestResult)

            return this.skip()
        }

        return this.continue()
    }
};
