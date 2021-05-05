const {Task} = require("./task");

module.exports.TaskTowerAttack = class TaskTowerAttack extends Task {
    constructor(target) {
        super(TASK_TYPE_TOWER_ATTACK)

        this.targetId = target && target.id
    }

    run(tower) {
        if (!tower || !(tower instanceof StructureTower)) {
            return false
        }

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const target = Game.getObjectById(this.targetId);
        if (!target) {
            Log.error('Unable to find target by id=' + this.targetId)

            return false
        }

        if (target.my) {
            Log.error('Found object is yours ' + target)

            return false
        }

        tower.attack(target)

        return false
    }
};
