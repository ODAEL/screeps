const {Task} = require("./task");

module.exports.TaskPickup = class TaskPickup extends Task {
    constructor(creep, resource) {
        super(creep && creep.id, TASK_TYPE_PICKUP)

        this.resourceId = resource && resource.id
    }

    run() {
        const resource = Game.getObjectById(this.resourceId);
        if (!resource) {
            return false
        }

        if (!(resource instanceof Resource)) {
            Log.error('Found resource is not resource ' + resource)

            return false
        }

        if (resource.resourceType !== RESOURCE_ENERGY) {
            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
