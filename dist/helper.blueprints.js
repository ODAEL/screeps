const taskBlueprintsOrder = (taskBlueprintsOrderList) => {
    const taskBlueprintsOrder = [];
    for (let listItem of taskBlueprintsOrderList) {
        for (let i = 0; i < listItem.times; i++) {
            taskBlueprintsOrder.push(listItem.blueprint)
        }
    }

    return taskBlueprintsOrder
};

const getStructuresByBlueprint = (roomWrapper, blueprint) => {
    const my = blueprint.my;
    const minHitPercentage = blueprint.minHitPercentage;
    const maxFreeCapacityEnergy = blueprint.maxFreeCapacityEnergy;
    let structureTypes = blueprint.structureTypes;
    if (structureTypes) {
        if (!(structureTypes instanceof Array)) {
            structureTypes = [structureTypes]
        }
    }

    return roomWrapper.structures((object) => {
        return (my === undefined || object.my === my) &&
            (!minHitPercentage || (object.hits / object.hitsMax) < minHitPercentage) &&
            (maxFreeCapacityEnergy === undefined || (object.store && object.store.getFreeCapacity(RESOURCE_ENERGY) > maxFreeCapacityEnergy)) &&
            (!structureTypes || structureTypes.indexOf(object.structureType) !== -1)
    })
};

module.exports = {
    taskBlueprintsOrder: taskBlueprintsOrder,
    getStructuresByBlueprint: getStructuresByBlueprint,
};