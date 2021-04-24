const afterHarvestTaskBlueprintsOrderList = [
    {times: 8, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], my: true, maxFreeCapacityEnergy: 0}},
    {times: 1, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_TOWER, my: true, maxFreeCapacityEnergy: 0}},
    {times: 1, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_CONTAINER, maxFreeCapacityEnergy: 0}},
    {times: 1, blueprint: {type: TASK_TYPE_UPGRADE_CONTROLLER}},
    {times: 3, blueprint: {type: TASK_TYPE_BUILD}},
    {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50}},
    {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001}},
    {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2}},
]

const processCreep = (creep) => {
    if (tc.runCreep(creep)) {
        return
    }

    processCreepNewTask(creep)

    tc.runCreep(creep)
};

var processCreepNewTask = (creep) => {
    
    if (processHarvest(creep)) {
        return
    }
    
    processAfterHarvest(creep)
}

var processHarvest = (creep) => {
    const roomWrapper = new RoomWrapper(creep.room);

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
        return false
    }

    const sources = roomWrapper.availableSources((object) => {
        const sourceWrapper = new SourceWrapper(object);

        return sourceWrapper.availableHarvestPos().length > sourceWrapper.connectedCreeps().length
    });

    if (sources.length === 0) {
        return false
    }

    const source = helpers.findClosest(creep, sources);
    tc.harvest(creep, source.id)
            
    return true
}

var processAfterHarvest = (creep) => {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        return false
    }

    const taskBlueprints = blueprintsHelper.taskBlueprintsOrder(afterHarvestTaskBlueprintsOrderList);

    let numberOfIterations = 0;

    do {
        if (numberOfIterations++ > taskBlueprints.length) {
            log('Panic! numberOfIterations was ' + numberOfIterations + ' while iterating on ' + taskBlueprints.length + ' items')
            return false
        }
        Memory.blueprintsOrderPosition.creep =  Memory.blueprintsOrderPosition.creep < taskBlueprints.length ? Memory.blueprintsOrderPosition.creep : 0
    } while (!processTaskBlueprint(creep, taskBlueprints[Memory.blueprintsOrderPosition.creep++]))
    
    return true
}

var processTaskBlueprint = (creep, blueprint) => {
    const roomWrapper = new RoomWrapper(creep.room);

    if (blueprint.type === TASK_TYPE_TRANSFER) {
        var targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint)
        if (targets.length === 0) {
            return false
        }
        
        var target = helpers.findClosest(creep, targets)

        tc.transfer(creep, target.id)

        return true
    }
    
    if (blueprint.type === TASK_TYPE_BUILD) {
        const myConstructionSites = roomWrapper.myConstructionSites();
        if (myConstructionSites.length === 0) {
            return false
        }
        
        var target = helpers.findClosest(creep, myConstructionSites)
        
        tc.build(creep, target.id)
        
        return true
    }
    
    if (blueprint.type === TASK_TYPE_UPGRADE_CONTROLLER) {
        const controller = roomWrapper.controller();
        if (!controller) {
            return false
        }
        tc.upgradeController(creep, controller.id)
        
        return true
    }
    
    if (blueprint.type === TASK_TYPE_REPAIR) {
        var targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint)
        if (targets.length === 0) {
            return false
        }
        
        var target = helpers.findClosest(creep, targets)
        
        tc.repair(creep, target.id)
                
        return true
    }
    
    return false
}

module.exports = {
    process: () => {
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.spawning) {
                continue
            }
            processCreep(creep)
        }
    },
};