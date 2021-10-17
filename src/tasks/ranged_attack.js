const {Task} = require("./task");

module.exports.TaskRangedAttack = class TaskRangedAttack extends Task {
    constructor(target, data) {
        super(TASK_TYPE_RANGED_ATTACK)

        this.targetId = target && target.id
        this.data = data || {}
    }

    run(creep) {
        let restrictMove = this.data.restrictMove || false
        let pursue = this.data.pursue || false

        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return this.skip()
        }

        creep.say(this.type)

        if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
            if (restrictMove) {
                return this.skip()
            }

            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            if (pursue) {
                return this.continue()
            }

            return this.finish()
        }

        creep.say('Done!')

        return this.finish()
    }
};
