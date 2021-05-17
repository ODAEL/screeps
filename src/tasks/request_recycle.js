const {Task} = require("./task");

module.exports.TaskRequestRecycle = class TaskRequestRecycle extends Task {
    constructor(spawn) {
        super(TASK_TYPE_REQUEST_RECYCLE)

        this.spawnId = spawn && spawn.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const spawn = Game.getObjectById(this.spawnId);
        if (!spawn) {
            Log.error('Unable to find spawn ' + this.spawnId)

            return this.skip()
        }
        if (!(spawn instanceof StructureSpawn)) {
            Log.error('Found spawn is not spawn ' + spawn)

            return this.skip()
        }

        creep.say(this.type)

        if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn)

            return this.continue()
        }

        return this.finish()
    }
};
