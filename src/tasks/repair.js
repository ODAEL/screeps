const {Task} = require("./task");

module.exports.TaskRepair = class TaskRepair extends Task {
    constructor(structure) {
        super(TASK_TYPE_REPAIR)

        this.structureId = structure && structure.id
    }

    run(subject) {
        if (!subject || !(subject instanceof Creep || subject instanceof StructureTower)) {
            return this.skip()
        }

        if (subject.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const structure = Game.getObjectById(this.structureId);
        if (!structure) {
            Log.error(2)
            Log.error('Unable to find target by id=' + this.structureId)

            return this.skip()
        }

        if (!(structure instanceof Structure)) {
            Log.error('Found object is not structure ' + structure)

            return this.skip()
        }

        if (structure.hitsMax === structure.hits) {
            Log.error('Structure has maximum hits ' + structure)

            return this.skip()
        }

        subject instanceof Creep && subject.say(this.type)

        if (subject.repair(structure) === ERR_NOT_IN_RANGE) {
            if (subject instanceof Creep) {
                subject.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                return this.skip()
            }

            return this.continue()
        }

        subject instanceof Creep && subject.say('Done!')

        return this.finish()
    }
};
