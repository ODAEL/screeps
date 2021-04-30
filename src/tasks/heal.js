const {Task} = require("./task");

module.exports.TaskHeal = class TaskHeal extends Task {
    constructor(subject, creep) {
        super(subject && subject.id, TASK_TYPE_HEAL)

        this.creepId = creep && creep.id
    }


    run() {
        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            Log.error('Unable to find creep by id=' + this.creepId)

            return false
        }

        if (!(creep instanceof Creep)) {
            Log.error('Found object is not creep ' + creep)

            return false
        }

        if (creep.hitsMax === creep.hits) {
            Log.error('Creep has maximum hits ' + creep)

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

        if (subject.heal(creep) === ERR_NOT_IN_RANGE) {
            if (subject instanceof Creep) {
                subject.moveTo(creep, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                return false
            }

            return true
        }

        if (creep.hitsMax === creep.hits) {
            return false
        }

        // TODO Uncomment and do something with tower long healing
        // if (subject.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        //     return true
        // }

        subject instanceof Creep && subject.say('Done!')

        return false
    }
};
