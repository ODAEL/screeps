const {Task} = require("./task");

module.exports.TaskRenewCreep = class TaskRenewCreep extends Task {
    constructor(creep) {
        super(TASK_TYPE_RENEW_CREEP)

        this.creepId = creep && creep.id
    }

    run(spawn) {
        if (!spawn) {
            return false
        }

        if (spawn.spawning) {
            return false
        }

        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            return false
        }

        spawn.renewCreep(creep)

        return false
    }
};
