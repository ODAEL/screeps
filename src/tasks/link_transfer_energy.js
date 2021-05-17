const {Task} = require("./task");

module.exports.TaskLinkTransferEnergy = class TaskLinkTransferEnergy extends Task {
    constructor(targetLink) {
        super(TASK_TYPE_LINK_TRANSFER_ENERGY)

        this.targetLinkId = targetLink && targetLink.id
    }

    run(link) {
        if (!link || !(link instanceof StructureLink)) {
            return this.skip()
        }

        if (link.cooldown !== 0) {
            return this.skip()
        }

        if (link.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const targetLink = Game.getObjectById(this.targetLinkId);
        if (!targetLink) {
            Log.error('Unable to find target link by id=' + this.targetLinkId)

            return this.skip()
        }

        if (!(targetLink instanceof StructureLink)) {
            Log.error('Found object is not link ' + targetLink)

            return this.skip()
        }

        if (!targetLink.my) {
            Log.error('Found object is yours ' + targetLink)

            return this.skip()
        }

        if (targetLink.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        link.transferEnergy(targetLink)

        return this.finish()
    }
};
