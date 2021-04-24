class TaskTowerAttack extends Task {
    constructor(tower, target) {
        super(TASK_SUBJECT_TYPE_TOWER, tower && tower.id, TASK_TYPE_TOWER_ATTACK)
        
        this.targetId = target && target.id
    }
    
    run() {
        const target = Game.getObjectById(this.targetId);
        if (!target) {
            debug('Unable to find target by id=' + this.targetId)
            
            return false
        }
        
        if (target.my) {
            debug('Found object is yours ' + target)
            
            return false
        }

        const tower = Game.getObjectById(this.subjectId);
        if (!tower || !(tower instanceof StructureTower)) {
            return false
        }
        
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }
        
        tower.attack(target)
        
        return false
    }
    
    static deserialize(task) {
        return super.deserialize(task, TaskTowerAttack)
    }
}

module.exports = TaskTowerAttack