const {Task} = require("./task");

module.exports.TaskAttackController = class TaskAttackController extends Task {
    constructor(controller) {
        super(TASK_TYPE_ATTACK_CONTROLLER)

        this.controllerId = controller && controller.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        if (creep.getActiveBodyparts(CLAIM) === 0) {
            Log.error('Creep has no CLAIM bodypart ' + creep)

            return this.skip()
        }

        const controller = Game.getObjectById(this.controllerId);
        if (!controller) {
            Log.error('Unable to find controller by id=' + this.controllerId)

            return this.skip()
        }

        if (!(controller instanceof StructureController)) {
            Log.error('Found controller is not controller ' + controller)

            return this.skip()
        }

        if (controller.owner) {
            Log.error('Found controller has owner ' + controller)

            return this.skip()
        }

        creep.say(this.type)

        if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});

            return this.continue()
        }

        creep.say('Done!')

        return this.finish()
    }
};
