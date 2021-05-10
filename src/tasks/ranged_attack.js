const {Task} = require("./task");

module.exports.TaskRangedAttack = class TaskRangedAttack extends Task {
    constructor(target) {
        super(TASK_TYPE_RANGED_ATTACK)

        this.targetId = target && target.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return false
        }

        creep.say(this.type)

        if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
