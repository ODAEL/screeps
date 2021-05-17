const {Task} = require("./task");

module.exports.TaskAttack = class TaskAttack extends Task {
    constructor(target) {
        super(TASK_TYPE_ATTACK)

        this.targetId = target && target.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return this.skip()
        }

        creep.say(this.type)

        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
