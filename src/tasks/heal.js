const {Task} = require("./task");

module.exports.TaskHeal = class TaskHeal extends Task {
    constructor(creep, data) {
        super(TASK_TYPE_HEAL)

        this.creepId = creep && creep.id
        this.data = data || {}
    }

    run(subject) {
        let restrictMove = this.data.restrictMove || false

        if (!subject || !(subject instanceof Creep || subject instanceof StructureTower)) {
            return this.skip()
        }

        if ((subject instanceof StructureTower) && subject.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            Log.error('Unable to find creep by id=' + this.creepId)

            return this.skip()
        }

        if (!(creep instanceof Creep)) {
            Log.error('Found object is not creep ' + creep)

            return this.skip()
        }

        if (creep.hitsMax === creep.hits) {
            Log.error('Creep has maximum hits ' + creep)

            return this.skip()
        }

        subject instanceof Creep && subject.say(this.type)

        let healResult = subject.heal(creep)

        if (healResult === ERR_NOT_IN_RANGE) {
            // WTF?
            if (subject instanceof StructureTower) {
                return this.skip()
            }

            let rangedHealResult = subject.rangedHeal(creep)

            if (rangedHealResult !== ERR_NOT_IN_RANGE) {
                return this.skip()
            }

            if (restrictMove) {
                return this.skip()
            }

            subject.moveTo(creep, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        subject instanceof Creep && subject.say('Done!')

        return this.finish()
    }
};
