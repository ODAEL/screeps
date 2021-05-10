const {Task} = require("./task");

module.exports.TaskAttack = class TaskAttack extends Task {
    constructor(target) {
        super(TASK_TYPE_ATTACK)

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

        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
