const {Task} = require("./task");

module.exports.TaskClaimController = class TaskClaimController extends Task {
    constructor(controller) {
        super(TASK_TYPE_CLAIM_CONTROLLER)

        this.controllerId = controller && controller.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.getActiveBodyparts(CLAIM) === 0) {
            Log.error('Creep has no CLAIM bodypart ' + creep)

            return false
        }

        const controller = Game.getObjectById(this.controllerId);
        if (!controller) {
            Log.error('Unable to find controller by id=' + this.controllerId)

            return false
        }

        if (!(controller instanceof StructureController)) {
            Log.error('Found controller is not controller ' + controller)

            return false
        }

        if (controller.owner) {
            Log.error('Found controller has owner ' + controller)

            return false
        }

        creep.say(this.type)

        if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        creep.say('Done!')

        return false
    }
};
