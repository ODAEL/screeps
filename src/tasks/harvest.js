const {Task} = require("./task");

module.exports.TaskHarvest = class TaskHarvest extends Task {
    constructor(creep, target) {
        super(creep && creep.id, TASK_TYPE_HARVEST)

        this.targetId = target && target.id
    }

    run() {
        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getFreeCapacity() === 0) {
            return false
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return false
        }

        if (!(target instanceof Source) && !(target instanceof Mineral)) {
            Log.error('Fount target is not source or mineral ' + target)

            return false
        }

        creep.say(this.type)

        const harvestResult = creep.harvest(target);
        if (harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            return true
        }
        if (harvestResult === ERR_NOT_ENOUGH_RESOURCES) {
            return false
        }

        if (target instanceof Mineral && harvestResult === ERR_TIRED) {
            // Log.error('Wait')

            return true
        }

        if (harvestResult !== OK) {
            Log.error('Error while harvest ' + harvestResult)

            return false
        }

        return true
    }
}
