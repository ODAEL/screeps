const {Task} = require("./task");

module.exports.TaskAttack = class TaskAttack extends Task {
    constructor(target, data) {
        super(TASK_TYPE_ATTACK)

        this.targetId = target && target.id
        this.data = data
    }

    run(creep) {
        let restrictMove = this.data.restrictMove || false

        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            return this.skip()
        }

        creep.say(this.type)

        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            if (restrictMove) {
                return this.skip()
            }

            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
