const {Task} = require("./task");

module.exports.TaskMove = class TaskMove extends Task {
    constructor(direction) {
        super(TASK_TYPE_MOVE)

        this.direction = direction
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const direction = this.direction;
        if (!direction) {
            Log.error('No direction ' + direction)

            return this.skip()
        }

        creep.say(this.type)

        let result = creep.move(direction);
        // if (result !== OK) {
        //     Log.error('MoveTo - result ' + result)
        //
        //     return this.finish()
        // }

        creep.say('Done!')

        return this.skip()
    }
};
