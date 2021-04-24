var taskBlueprintsOrder = (taskBlueprintsOrderList) => {
    var taskBlueprintsOrder = []
    for (var listItem of taskBlueprintsOrderList) {
        for (var i = 0; i < listItem.times; i++) {
            taskBlueprintsOrder.push(listItem.blueprint)
        }
    }
    
    return taskBlueprintsOrder
}

var getStructuresByBlueprint = (roomWrapper, blueprint) => {
    var my = blueprint.my
    var minHitPercentage = blueprint.minHitPercentage
    var maxFreeCapacityEnergy = blueprint.maxFreeCapacityEnergy
    var structureTypes = blueprint.structureTypes
    if (structureTypes) {
        if (!(structureTypes instanceof Array)) {
            structureTypes = [structureTypes]
        }
    }
    
    return roomWrapper.structures((object) => {
        return (my == undefined || object.my == my) &&
            (!minHitPercentage || (object.hits / object.hitsMax) < minHitPercentage) &&
            (maxFreeCapacityEnergy == undefined || (object.store && object.store.getFreeCapacity(RESOURCE_ENERGY) > maxFreeCapacityEnergy)) &&
            (!structureTypes || structureTypes.indexOf(object.structureType) != -1)
    })
}

module.exports = {
    taskBlueprintsOrder: taskBlueprintsOrder,
    getStructuresByBlueprint: getStructuresByBlueprint,
};