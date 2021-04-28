const {TaskLinkTransferEnergy} = require("./tasks");
const {TaskWithdraw} = require("./tasks");
const {TaskPickup} = require("./tasks");
const {TaskHeal} = require("./tasks");
const {TaskTowerAttack} = require("./tasks");
const {TaskRepair} = require("./tasks");
const {TaskUpgradeController} = require("./tasks");
const {TaskBuild} = require("./tasks");
const {TaskTransfer} = require("./tasks");
const {TaskHarvest} = require("./tasks");
const {TaskRenewCreep} = require("./tasks");
const {TaskSpawnCreep} = require("./tasks");
const {__} = require("./filters");
const {Helpers} = require("./helpers");
const {Filters} = require("./filters");
const {RoomWrapper} = require("./wrappers");

const getRoomWrapper = (subject) => {
    return new RoomWrapper(subject.room)
}

const getDefaultFilters = (subject, type) => {
    switch (type) {
        case TASK_TYPE_RENEW_CREEP:
            return [
                Filters.my(),
                Filters.nearTo(subject),
            ];
        case TASK_TYPE_HARVEST:
            return [
                __.or(
                    __.and(
                        Filters.instanceof(Source),
                        Filters.energy(__.gt(0)),
                    ),
                    // __.and(
                    //     Filters.instanceof(StructureExtension),
                    //     Filters.freeCapacity(__.gt(0)),
                    // ),
                ),
            ];
        case TASK_TYPE_TRANSFER:
            return [
                Filters.withStore(),
                Filters.freeCapacity(__.gt(0)),
            ];
        case TASK_TYPE_BUILD:
            return [
                Filters.my(),
            ];
        case TASK_TYPE_HEAL:
            return [
                Filters.my(),
                Filters.hitsPercentage(__.lt(1.0)),
            ];
        case TASK_TYPE_WITHDRAW:
            return [
                Filters.withStore(),
                Filters.my(false),
                Filters.usedCapacity(__.gt(0)),
            ];
        case TASK_TYPE_LINK_TRANSFER_ENERGY:
            return [
                Filters.structureType(__.eq(STRUCTURE_LINK)),
                Filters.my(true),
                Filters.freeCapacity(__.gt(0))
            ];
        default:
            return [];
    }
}

module.exports.BlueprintManager = {
    taskByBlueprint: (subject, blueprint) => {
        let filter,
            creeps, creep,
            structures, structure,
            constructionSites, constructionSite,
            targets, target,
            resources, resource,
            targetLinks, targetLink,
            controller

        const defaultFilters = getDefaultFilters(subject, blueprint.type);

        switch (blueprint.type) {
            // TODO Support data
            case TASK_TYPE_SPAWN_CREEP:
                return new TaskSpawnCreep(subject);

            case TASK_TYPE_RENEW_CREEP:
                filter = __.and(...defaultFilters, ...blueprint.creepFilters);
                creeps = getRoomWrapper(subject).creeps(filter);

                if (creeps.length === 0) {
                    return null;
                }

                creep = creeps[0];

                return new TaskRenewCreep(subject, creep);

            case TASK_TYPE_HARVEST:
                filter = __.and(...defaultFilters, ...blueprint.targetFilters);
                // TODO Refactor
                targets = [...getRoomWrapper(subject).currentAvailableSources(filter), ...[]];
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskHarvest(subject, target);

            case TASK_TYPE_TRANSFER:
                filter = __.and(...defaultFilters, ...blueprint.structureFilters);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskTransfer(subject, structure);

            case TASK_TYPE_BUILD:
                filter = __.and(...defaultFilters, ...blueprint.constructionSiteFilters);
                constructionSites = getRoomWrapper(subject).constructionSites(filter);
                constructionSite = Helpers.findClosest(subject, constructionSites);

                if (!constructionSite) {
                    return null;
                }

                return new TaskBuild(subject, constructionSite);

            case TASK_TYPE_UPGRADE_CONTROLLER:
                controller = getRoomWrapper(subject).controller()

                if (!controller) {
                    return null;
                }

                return new TaskUpgradeController(subject, controller)

            case TASK_TYPE_REPAIR:
                filter = __.and(...defaultFilters, ...blueprint.structureFilters);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskRepair(subject, structure);

            case TASK_TYPE_HEAL:
                filter = __.and(...defaultFilters, ...blueprint.creepFilters);
                creeps = getRoomWrapper(subject).creeps(filter);
                creep = Helpers.findClosest(subject, creeps);

                if (!creep) {
                    return null;
                }

                return new TaskHeal(subject, creep);

            case TASK_TYPE_PICKUP:
                filter = __.and(...defaultFilters, ...blueprint.resourceFilters);
                resources = getRoomWrapper(subject).droppedResources(filter);
                resource = Helpers.findClosest(subject, resources);

                if (!resource) {
                    return null;
                }

                return new TaskPickup(subject, resource);

            case TASK_TYPE_WITHDRAW:
                filter = __.and(...defaultFilters, ...blueprint.targetFilters);
                targets = [...getRoomWrapper(subject).structures(filter), ...getRoomWrapper(subject).tombstones(filter)];
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskWithdraw(subject, target);

            case TASK_TYPE_TOWER_ATTACK:
                filter = __.and(...defaultFilters, ...blueprint.targetFilters);
                targets = getRoomWrapper(subject).hostileCreeps(filter);
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskTowerAttack(subject, target);

            case TASK_TYPE_LINK_TRANSFER_ENERGY:
                filter = __.and(...defaultFilters, ...blueprint.targetLinkFilters);
                targetLinks = getRoomWrapper(subject).structures(filter);
                targetLink = Helpers.findClosest(subject, targetLinks);

                if (!targetLink) {
                    return null;
                }

                return new TaskLinkTransferEnergy(subject, targetLink);

            default:
                return null;
        }
    }
};

module.exports.Blueprint = {
    spawnCreep: (data) => ({type: TASK_TYPE_SPAWN_CREEP, data: data}),
    renewCreep: (creepFilters = []) => ({type: TASK_TYPE_RENEW_CREEP, creepFilters: creepFilters}),
    harvest: (targetFilters = []) => ({type: TASK_TYPE_HARVEST, targetFilters: targetFilters}),
    transfer: (structureFilters = []) => ({type: TASK_TYPE_TRANSFER, structureFilters: structureFilters}),
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
