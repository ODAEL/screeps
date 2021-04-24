class TaskBuild extends Task {
    constructor(creep, constructionSite) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_BUILD)
        
        this.constructionSiteId = constructionSite && constructionSite.id
    }
    
    run() {
        var constructionSite = this.getObjectById(this.constructionSiteId)
        if (!constructionSite) {
            return false
        }
        
        if (!(constructionSite instanceof ConstructionSite)) {
            debug('Target is not a construction site')
            
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
        
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
            
            return true
        }
        
        // If have built
        var constructionSite = Game.getObjectById(this.constructionSiteId)
        if (!constructionSite) {
            return false
        }
        
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return true
        }
        
        creep.say('Done!')
        
        return false
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskBuild)
    }
}

module.exports = TaskBuild