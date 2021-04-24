class TaskSpawnCreep extends Task {
    constructor(spawn) {
        super(TASK_SUBJECT_TYPE_SPAWN, spawn && spawn.id, TASK_TYPE_SPAWN_CREEP)
    }
    
    run() {
        var spawn = Game.getObjectById(this.subjectId)
        
        if (spawn.spawnCreep(this.chooseBodyParts(), 'Creep ' + Game.time) == OK) {
            return false
        }
        
        return true
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskSpawnCreep)
    }
    
    chooseBodyParts() {
        var roomWrapper = new RoomWrapper(Game.getObjectById(this.subjectId).room)
        var energyCapasityAvailable = roomWrapper.energyCapasityAvailable()
        
        var i = 0
        var bodyParts = []
        var totalCost = 0
        
        if (roomWrapper.myCreeps().length == 0) {
            return [WORK, CARRY, MOVE]
        }
        
        while (true) {
            var bodyPart, cost
            if (i % 3 == 0) {
                bodyPart = MOVE
                cost = 50
            }
            if (i % 3 == 1) {
                bodyPart = WORK
                cost = 100
            }
            if (i % 3 == 2) {
                bodyPart = CARRY
                cost = 50
            }
            
            if (totalCost + cost > energyCapasityAvailable) {
                break
            }
            
            bodyParts.push(bodyPart)
            totalCost += cost
            
            i++
        }
        
        if (energyCapasityAvailable - totalCost >= 50) {
            bodyParts.push(MOVE)
        }
        
        return bodyParts
    }
}

module.exports = TaskSpawnCreep