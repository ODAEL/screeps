const {Task} = require("./task");

module.exports.TaskBuild = class TaskBuild extends Task {
    constructor(constructionSite) {
        super(TASK_TYPE_BUILD)

        this.constructionSiteId = constructionSite && constructionSite.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const constructionSite = Game.getObjectById(this.constructionSiteId);
        if (!constructionSite) {
            return false
        }

        if (!(constructionSite instanceof ConstructionSite)) {
            Log.error('Target is not a construction site')

            return false
        }

        creep.say(this.type)

        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        // If have built
        if (!Game.getObjectById(this.constructionSiteId)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return true
        }

        creep.say('Done!')

        return false
    }
};
