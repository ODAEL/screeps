const {Task} = require("./task");

module.exports.TaskUpgradeController = class TaskUpgradeController extends Task {
    constructor(controller) {
        super(TASK_TYPE_UPGRADE_CONTROLLER)

        this.controllerId = controller && controller.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const controller = Game.getObjectById(this.controllerId);
        if (!controller) {
            Log.error('Unable to find controller by id=' + this.controllerId)

            return this.skip()
        }

        if (!(controller instanceof StructureController)) {
            Log.error('Found object is not a controller ' + controller)

            return this.skip()
        }

        creep.say(this.type)

        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return this.continue()
        }

        creep.say('Done!')

        return this.skip()
    }
};
