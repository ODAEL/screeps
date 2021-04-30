const {Task} = require("./task");

module.exports.TaskUpgradeController = class TaskUpgradeController extends Task {
    constructor(creep, controller) {
        super(creep && creep.id, TASK_TYPE_UPGRADE_CONTROLLER)

        this.controllerId = controller && controller.id
    }

    run() {
        const controller = Game.getObjectById(this.controllerId);
        if (!controller) {
            Log.error('Unable to find controller by id=' + this.controllerId)

            return false
        }

        if (!(controller instanceof StructureController)) {
            Log.error('Found object is not a controller ' + controller)

            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return true
        }

        creep.say('Done!')

        return false
    }
};
