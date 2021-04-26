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
        case TASK_TYPE_TRANSFER:
            return [
                Filters.freeCapacityEnergy(__.gt(0)),
            ];
        default:
            return [];
    }
}

module.exports.BlueprintManager = {
    taskByBlueprint: (subject, blueprint) => {
        let filter,
            creeps, creep,
            sources, source,
            structures, structure,
            constructionSites, constructionSite,
            targets, target,
            controller

        const defaultFilters = getDefaultFilters(subject, blueprint.type);

        switch (blueprint.type) {
            case TASK_TYPE_SPAWN_CREEP:
                return new TaskSpawnCreep(subject);

            case TASK_TYPE_RENEW_CREEP:
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.creepFilters]);
                creeps = getRoomWrapper(subject).creeps(filter);

                if (creeps.length === 0) {
                    return null;
                }

                creep = creeps[0];

                return new TaskRenewCreep(subject, creep);

            case TASK_TYPE_HARVEST:
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.sourceFilters]);
                sources = getRoomWrapper(subject).currentAvailableSources(filter);
                source = Helpers.findClosest(subject, sources);

                if (!source) {
                    return null;
                }

                return new TaskHarvest(subject, source);

            case TASK_TYPE_TRANSFER:
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.structureFilters]);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskTransfer(subject, structure);

            case TASK_TYPE_BUILD:
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.constructionSiteFilters]);
                constructionSites = getRoomWrapper(subject).myConstructionSites(filter);
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
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.structureFilters]);
                structures = getRoomWrapper(subject).structures(filter);
                structure = Helpers.findClosest(subject, structures);

                if (!structure) {
                    return null;
                }

                return new TaskRepair(subject, structure);

            case TASK_TYPE_TOWER_ATTACK:
                filter = Filters.combineFilters([...defaultFilters, ...blueprint.targetFilters]);
                targets = getRoomWrapper(subject).hostileCreeps(filter);
                target = Helpers.findClosest(subject, targets);

                if (!target) {
                    return null;
                }

                return new TaskTowerAttack(subject, target);

            default:
                return null;
        }
    }
};

module.exports.Blueprint = {
    spawnCreep: () => ({type: TASK_TYPE_SPAWN_CREEP}),
    renewCreep: (creepFilters = []) => ({type: TASK_TYPE_RENEW_CREEP, creepFilters: creepFilters}),
    harvest: (sourceFilters = []) => ({type: TASK_TYPE_HARVEST, sourceFilters: sourceFilters}),
    transfer: (structureFilters = []) => ({type: TASK_TYPE_TRANSFER, structureFilters: structureFilters}),
    build: (constructionSiteFilters = []) => ({type: TASK_TYPE_BUILD, constructionSiteFilters: constructionSiteFilters}),
    upgradeController: () => ({type: TASK_TYPE_UPGRADE_CONTROLLER}),
    repair: (structureFilters = []) => ({type: TASK_TYPE_REPAIR, structureFilters: structureFilters}),
    towerAttack: (targetFilters = []) => ({type: TASK_TYPE_TOWER_ATTACK, targetFilters: targetFilters}),
};
