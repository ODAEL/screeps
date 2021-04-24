class Task {
    constructor(subjectType, subjectId, type) {
        this.id = Game.time + '_' + Math.abs(Math.random() * 2e8 | 0)
        this.subjectType = subjectType
        this.subjectId = subjectId
        this.type = type
    }
    
    run() {
        debug('Not implemented')
        
        return false
    }
    
    static deserialize(task, taskClass = Task) {
        const obj = new taskClass();
        Object.assign(obj, task)
        
        return obj
    }
    
    getObjectById(id) {
        const object = Game.getObjectById(id);
        if (!object) {
            log('Unable to find object by id=' + id)
        }
        
        return object
    }
}

module.exports = Task
