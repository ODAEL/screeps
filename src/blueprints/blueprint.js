class Blueprint {
    constructor(type, filters, data) {
        this.type = type
        this.filters = filters
        this.data = data
    }
}

module.exports.Blueprint = Blueprint
module.exports.BlueprintBuilder = {
    spawnCreep: (data) => new Blueprint(TASK_TYPE_SPAWN_CREEP, {}, data),
    renewCreep: (creepFilters = []) => new Blueprint(TASK_TYPE_RENEW_CREEP, {creepFilters: creepFilters}),
    harvest: (targetFilters = []) => new Blueprint(TASK_TYPE_HARVEST, {targetFilters: targetFilters}),
    transfer: (structureFilters = [], data) => new Blueprint(TASK_TYPE_TRANSFER, {structureFilters: structureFilters}, data),
    build: (constructionSiteFilters = []) => new Blueprint(TASK_TYPE_BUILD, {constructionSiteFilters: constructionSiteFilters}),
    upgradeController: () => new Blueprint(TASK_TYPE_UPGRADE_CONTROLLER),
    repair: (structureFilters = []) => new Blueprint(TASK_TYPE_REPAIR, {structureFilters: structureFilters}),
    heal: (creepFilters = [], data) => new Blueprint(TASK_TYPE_HEAL, {creepFilters: creepFilters}, data),
    pickup: (resourceFilters = []) => new Blueprint(TASK_TYPE_PICKUP, {resourceFilters: resourceFilters}),
    withdraw: (targetFilters = [], data) => new Blueprint(TASK_TYPE_WITHDRAW, {targetFilters: targetFilters}, data),
    // moveTo: (targetFilters = []) => new Blueprint(TASK_TYPE_MOVE_TO, {targetFilters: targetFilters}), // No need
    // claimController: (controllerFilters = []) => new Blueprint(TASK_TYPE_CLAIM_CONTROLLER, {controllerFilters: controllerFilters}), // No need
    attack: (targetFilters = []) => new Blueprint(TASK_TYPE_ATTACK, {targetFilters: targetFilters}),
    rangedAttack: (targetFilters = [], data) => new Blueprint(TASK_TYPE_RANGED_ATTACK, {targetFilters: targetFilters}, data),
    move: (direction) => new Blueprint(TASK_TYPE_MOVE, {}, {direction: direction}),
    requestRecycle: (spawnFilters) => new Blueprint(TASK_TYPE_REQUEST_RECYCLE, {spawnFilters: spawnFilters}),
    dismantle: (structureFilters) => new Blueprint(TASK_TYPE_DISMANTLE, {structureFilters: structureFilters}),
    towerAttack: (targetFilters = []) => new Blueprint(TASK_TYPE_TOWER_ATTACK, {targetFilters: targetFilters}),
    linkTransferEnergy: (targetLinkFilters = []) => new Blueprint(TASK_TYPE_LINK_TRANSFER_ENERGY, {targetLinkFilters: targetLinkFilters}),
};
