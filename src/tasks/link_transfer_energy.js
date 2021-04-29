const {Task} = require("./task");

module.exports.TaskLinkTransferEnergy = class TaskLinkTransferEnergy extends Task {
    constructor(tower, targetLink) {
        super(TASK_SUBJECT_TYPE_LINK, tower && tower.id, TASK_TYPE_LINK_TRANSFER_ENERGY)

        this.targetLinkId = targetLink && targetLink.id
    }

    run() {
        const targetLink = Game.getObjectById(this.targetLinkId);
        if (!targetLink) {
            log('Unable to find target link by id=' + this.targetLinkId)

            return false
        }

        if (!(targetLink instanceof StructureLink)) {
            log('Found object is not link ' + targetLink)

            return false
        }

        if (!targetLink.my) {
            log('Found object is yours ' + targetLink)

            return false
        }

        if (targetLink.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const link = Game.getObjectById(this.subjectId);
        if (!link || !(link instanceof StructureLink)) {
            return false
        }

        if (link.cooldown !== 0) {
            return false
        }

        if (link.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        link.transferEnergy(targetLink)

        return false
    }
};
