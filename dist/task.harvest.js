class TaskHarvest extends Task {
    constructor(creep, source) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_HARVEST)
        
        this.sourceId = source && source.id
    }
    
    run() {
        const creep = Game.getObjectById(this.subjectId);

        if (!creep) {
            debug('Unable to find creep by id=' + this.subjectId)
            
            return false
        }
        
        creep.say(this.type)
        
        if(creep.store.getFreeCapacity() > 0) {
            const source = Game.getObjectById(this.sourceId);

            const harvestResult = creep.harvest(source);
            if (harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                return true
            }
            if (harvestResult === ERR_NOT_ENOUGH_RESOURCES) {
                return false
            }
            
            return true
        }
        
        return false
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskHarvest)
    }
}

module.exports = TaskHarvest