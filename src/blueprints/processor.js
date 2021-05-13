const {TaskRangedAttack} = require("../tasks/ranged_attack");
const {TaskAttack} = require("../tasks/attack");
const {TaskLinkTransferEnergy} = require("../tasks/link_transfer_energy");
const {TaskWithdraw} = require("../tasks/withdraw");
const {TaskPickup} = require("../tasks/pickup");
const {TaskHeal} = require("../tasks/heal");
const {TaskTowerAttack} = require("../tasks/tower_attack");
const {TaskRepair} = require("../tasks/repair");
const {TaskUpgradeController} = require("../tasks/upgrade_controller");
const {TaskBuild} = require("../tasks/build");
const {TaskTransfer} = require("../tasks/transfer");
const {TaskHarvest} = require("../tasks/harvest");
const {TaskRenewCreep} = require("../tasks/renew_creep");
const {TaskSpawnCreep} = require("../tasks/spawn_creep");
const {__} = require("../filters");
const {Helpers} = require("../helpers");
const {Filters} = require("../filters");
const {RoomWrapper} = require("../wrappers");

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
                    __.and(
                        Filters.instanceof(Mineral),
                        // TODO Mineral amount
                    ),
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

module.exports.BlueprintProcessor = {
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
                return new TaskSpawnCreep();

            case TASK_TYPE_RENEW_CREEP:
                filter = __.and(...defaultFilters, ...blueprint.filters.creepFilters);
                creeps = getRoomWrapper(subject).creeps(filter);

                if (creeps.length === 0) {
                    return null;
                }

                creep = creeps[0];

                return new TaskRenewCreep(creep);

            case TASK_TYPE_HARVEST:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetFilters);
                // TODO Refactor
                targets = [...getRoomWrapper(subject).currentAvailableSources(filter), ...getRoomWrapper(subject).minerals(filter)];
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskHarvest(target);

            case TASK_TYPE_TRANSFER:
                filter = __.and(...defaultFilters, ...blueprint.filters.structureFilters);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskTransfer(structure, blueprint.data);

            case TASK_TYPE_BUILD:
                filter = __.and(...defaultFilters, ...blueprint.filters.constructionSiteFilters);
                constructionSites = getRoomWrapper(subject).constructionSites(filter);
                constructionSite = Helpers.findClosest(subject, constructionSites);

                if (!constructionSite) {
                    return null;
                }

                return new TaskBuild(constructionSite);

            case TASK_TYPE_UPGRADE_CONTROLLER:
                controller = getRoomWrapper(subject).controller()

                if (!controller) {
                    return null;
                }

                return new TaskUpgradeController(controller)

            case TASK_TYPE_REPAIR:
                filter = __.and(...defaultFilters, ...blueprint.filters.structureFilters);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskRepair(structure);

            case TASK_TYPE_HEAL:
                filter = __.and(...defaultFilters, ...blueprint.filters.creepFilters);
                creeps = getRoomWrapper(subject).creeps(filter);
                creep = Helpers.findClosest(subject, creeps);

                if (!creep) {
                    return null;
                }

                return new TaskHeal(creep, blueprint.data);

            case TASK_TYPE_PICKUP:
                filter = __.and(...defaultFilters, ...blueprint.filters.resourceFilters);
                resources = getRoomWrapper(subject).droppedResources(filter);
                resource = Helpers.findClosest(subject, resources);

                if (!resource) {
                    return null;
                }

                return new TaskPickup(resource);

            case TASK_TYPE_WITHDRAW:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetFilters);
                targets = [...getRoomWrapper(subject).structures(filter), ...getRoomWrapper(subject).tombstones(filter), ...getRoomWrapper(subject).ruins(filter)];
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskWithdraw(target, blueprint.data);

            case TASK_TYPE_ATTACK:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetFilters);
                targets = [...getRoomWrapper(subject).hostileCreeps(filter), ...getRoomWrapper(subject).structures(filter)];
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskAttack(target);

            case TASK_TYPE_RANGED_ATTACK:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetFilters);
                targets = [...getRoomWrapper(subject).hostileCreeps(filter), ...getRoomWrapper(subject).structures(filter)];
                target = Helpers.findClosestByRange(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskRangedAttack(target, blueprint.data);

            case TASK_TYPE_MOVE:
                return new TaskRangedAttack(blueprint.data.direction);

            case TASK_TYPE_TOWER_ATTACK:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetFilters);
                targets = getRoomWrapper(subject).hostileCreeps(filter);
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskTowerAttack(target);

            case TASK_TYPE_LINK_TRANSFER_ENERGY:
                filter = __.and(...defaultFilters, ...blueprint.filters.targetLinkFilters);
                targetLinks = getRoomWrapper(subject).structures(filter);
                targetLink = Helpers.findClosest(subject, targetLinks);

                if (!targetLink) {
                    return null;
                }

                return new TaskLinkTransferEnergy(targetLink);

            default:
                return null;
        }
    }
};
