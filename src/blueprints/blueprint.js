module.exports.Blueprint = {
    spawnCreep: (data) => ({type: TASK_TYPE_SPAWN_CREEP, data: data}),
    renewCreep: (creepFilters = []) => ({type: TASK_TYPE_RENEW_CREEP, creepFilters: creepFilters}),
    harvest: (targetFilters = []) => ({type: TASK_TYPE_HARVEST, targetFilters: targetFilters}),
    transfer: (structureFilters = [], data) => ({type: TASK_TYPE_TRANSFER, structureFilters: structureFilters, data: data}),
    build: (constructionSiteFilters = []) => ({type: TASK_TYPE_BUILD, constructionSiteFilters: constructionSiteFilters}),
    upgradeController: () => ({type: TASK_TYPE_UPGRADE_CONTROLLER}),
    repair: (structureFilters = []) => ({type: TASK_TYPE_REPAIR, structureFilters: structureFilters}),
    heal: (creepFilters = []) => ({type: TASK_TYPE_HEAL, creepFilters: creepFilters}),
    pickup: (resourceFilters = []) => ({type: TASK_TYPE_PICKUP, resourceFilters: resourceFilters}),
    withdraw: (targetFilters = []) => ({type: TASK_TYPE_WITHDRAW, targetFilters: targetFilters}),
    // moveTo: (targetFilters = []) => ({type: TASK_TYPE_MOVE_TO, targetFilters: targetFilters}), No need
    // claimController: (controllerFilters = []) => ({type: TASK_TYPE_CLAIM_CONTROLLER, controllerFilters: controllerFilters}), No need
    towerAttack: (targetFilters = []) => ({type: TASK_TYPE_TOWER_ATTACK, targetFilters: targetFilters}),
    linkTransferEnergy: (targetLinkFilters = []) => ({type: TASK_TYPE_LINK_TRANSFER_ENERGY, targetLinkFilters: targetLinkFilters}),
};
