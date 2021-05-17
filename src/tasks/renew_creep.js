const {Task} = require("./task");

module.exports.TaskRenewCreep = class TaskRenewCreep extends Task {
    constructor(creep) {
        super(TASK_TYPE_RENEW_CREEP)

        this.creepId = creep && creep.id
    }

    run(spawn) {
        if (!spawn) {
            return this.skip()
        }

        if (spawn.spawning) {
            return this.skip()
        }

        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            return this.skip()
        }

        spawn.renewCreep(creep)

        return this.finish()
    }
};
