const {Task} = require("./task");

module.exports.TaskBuild = class TaskBuild extends Task {
    constructor(constructionSite) {
        super(TASK_TYPE_BUILD)

        this.constructionSiteId = constructionSite && constructionSite.id
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return this.skip()
        }

        const constructionSite = Game.getObjectById(this.constructionSiteId);
        if (!constructionSite) {
            return this.skip()
        }

        if (!(constructionSite instanceof ConstructionSite)) {
            Log.error('Target is not a construction site')

            return this.skip()
        }

        creep.say(this.type)

        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});

            return this.continue()
        }

        // creep.say('Done!')

        // TODO Check finishing properly
        return this.continue()
    }
};
