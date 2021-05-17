const {Task} = require("./task");

module.exports.TaskPickup = class TaskPickup extends Task {
    constructor(resource) {
        super(TASK_TYPE_PICKUP)

        this.resourceId = resource && resource.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const resource = Game.getObjectById(this.resourceId);
        if (!resource) {
            return this.skip()
        }

        if (!(resource instanceof Resource)) {
            Log.error('Found resource is not resource ' + resource)

            return this.skip()
        }

        if (resource.resourceType !== RESOURCE_ENERGY) {
            return this.skip()
        }

        creep.say(this.type)

        if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
