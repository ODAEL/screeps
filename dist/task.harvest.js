class TaskHarvest extends Task {
    constructor(creep, source) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_HARVEST)
        
        this.sourceId = source && source.id
    }
    
    run() {
        var creep = Game.getObjectById(this.subjectId)
        
        if (!creep) {
            debug('Unable to find creep by id=' + subjectId)
            
            return false
        }
        
        creep.say(this.type)
        
        if(creep.store.getFreeCapacity() > 0) {
            var source = Game.getObjectById(this.sourceId);
            
            var harvestResult = creep.harvest(source)
            if (harvestResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                return true
            }
            if (harvestResult == ERR_NOT_ENOUGH_RESOURCES) {
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