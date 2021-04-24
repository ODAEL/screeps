class TaskTransfer extends Task {
    constructor(creep, target) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_TRANSFER)
        
        this.targetId = target && target.id
    }
    
    run() {
        const target = Game.getObjectById(this.targetId);
        if (!target) {
            debug('Unable to find target by id=' + this.targetId)
            
            return false
        }
        
        if (target.store && target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
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
        
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            
            return true
        }
        
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // debug(creep.store.getCapacity(RESOURCE_ENERGY))
            return true
        }
        
        creep.say('Done!')
        
        return false
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskTransfer)
    }
}

module.exports = TaskTransfer