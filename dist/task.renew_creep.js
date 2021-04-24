class TaskRenewCreep extends Task {
    constructor(spawn, creep) {
        super(TASK_SUBJECT_TYPE_SPAWN, spawn && spawn.id, TASK_TYPE_RENEW_CREEP)
        
        this.creepId = creep && creep.id
    }
    
    run() {
        const spawn = Game.getObjectById(this.subjectId);
        if (!spawn) {
            return false
        }
        
        if (spawn.spawning) {
            return false
        }

        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            return false
        }
        
        spawn.renewCreep(creep)
        
        return false
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskRenewCreep)
    }
}

module.exports = TaskRenewCreep