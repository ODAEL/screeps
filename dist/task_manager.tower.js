const taskBlueprintsOrderList = [
    {times: 2, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50}},
    {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001}},
    {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2}},
    {times: 4, blueprint: {type: TASK_TYPE_TOWER_ATTACK}},
]

var processTower = (tower) => {
    if (tc.runTower(tower)) {
        return
    }
    
    processTowerNewTask(tower)
    
    tc.runTower(tower)
}

var processTowerNewTask = (tower) => {
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return false
    }
    
    var taskBlueprints = blueprintsHelper.taskBlueprintsOrder(taskBlueprintsOrderList)
    
    var numberOfIterations = 0
    
    do {
        if (numberOfIterations++ > taskBlueprints.length) {
            return false
        }
        Memory.blueprintsOrderPosition.tower =  Memory.blueprintsOrderPosition.tower < taskBlueprints.length ? Memory.blueprintsOrderPosition.tower : 0
    } while (!processTaskBlueprint(tower, taskBlueprints[Memory.blueprintsOrderPosition.tower++]))
    
    return true
}

var processTaskBlueprint = (tower, blueprint) => {
    var roomWrapper = new RoomWrapper(tower.room)
    
    if (blueprint.type == TASK_TYPE_REPAIR) {
        var targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint)
        if (targets.length == 0) {
            return false
        }
        
        var target = helpers.findClosest(tower, targets)
        
        tc.repair(tower, target.id)
                
        return true
    }
    
    if (blueprint.type == TASK_TYPE_TOWER_ATTACK) {
        var targets = roomWrapper.hostileCreeps()
        if (targets.length == 0) {
            return false
        }
        
        var target = helpers.findClosest(tower, targets)
        
        tc.towerAttack(tower, target.id)
        
        return true
    }
    
    return false
}

module.exports = {
    process: () => {
        for (var name in Game.structures) {
            var structure = Game.structures[name]
            if (!(structure instanceof StructureTower)) {
                continue
            }
            
            processTower(structure)
        }
    }
};