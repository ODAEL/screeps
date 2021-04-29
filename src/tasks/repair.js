const {Task} = require("./task");

module.exports.TaskRepair = class TaskRepair extends Task {
    constructor(subject, structure) {
        super(subject && subject.id, TASK_TYPE_REPAIR)

        this.structureId = structure && structure.id
    }

    run() {
        const structure = Game.getObjectById(this.structureId);
        if (!structure) {
            log(2)
            log('Unable to find target by id=' + this.structureId)

            return false
        }

        if (!(structure instanceof Structure)) {
            log('Found object is not structure ' + structure)

            return false
        }

        if (structure.hitsMax === structure.hits) {
            log('Structure has maximum hist ' + structure)

            return false
        }

        const subject = Game.getObjectById(this.subjectId);
        if (!subject || !(subject instanceof Creep || subject instanceof StructureTower)) {
            return false
        }

        if (subject.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        subject instanceof Creep && subject.say(this.type)

        if (subject.repair(structure) === ERR_NOT_IN_RANGE) {
            if (subject instanceof Creep) {
                subject.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                return false
            }

            return true
        }

        if (structure.hitsMax === structure.hits) {
            return false
        }

        // TODO Uncomment and do something with tower long repairing
        // if (subject.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        //     return true
        // }

        subject instanceof Creep && subject.say('Done!')

        return false
    }
}