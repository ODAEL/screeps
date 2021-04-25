class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        let task = tc.currentTask(this.subject);
        if (!task) {
            this.processNewTask();
            task = tc.currentTask(this.subject);
        }

        tc.runTask(task);
    }

    processNewTask() {}
}

class SpawnTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let spawn = this.subject
        const roomWrapper = new RoomWrapper(spawn.room);
        if (roomWrapper.availableHarvestPos().length + 1 > roomWrapper.myCreeps().length &&
            (roomWrapper.myCreeps().length === 0 || (roomWrapper.energyCapacityAvailable() === roomWrapper.energyAvailable()))) {
            tc.spawnCreep(spawn)

            return;
        }

        const spawnWrapper = new SpawnWrapper(spawn);
        const myCreepsNear = spawnWrapper.myCreepsNear((object) => {
            return object.ticksToLive < 800
        });
        if (myCreepsNear.length > 0) {
            tc.renewCreep(spawn, myCreepsNear[0])

            return;
        }
    }
}

class CreepTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        this.afterHarvestTaskBlueprintsOrderList = [
            {times: 8, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], my: true, maxFreeCapacityEnergy: 0}},
            {times: 1, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_TOWER, my: true, maxFreeCapacityEnergy: 0}},
            {times: 1, blueprint: {type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_CONTAINER, maxFreeCapacityEnergy: 0}},
            {times: 1, blueprint: {type: TASK_TYPE_UPGRADE_CONTROLLER}},
            {times: 3, blueprint: {type: TASK_TYPE_BUILD}},
            {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50}},
            {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001}},
            {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2}},
        ]

        if (this.processHarvest()) {
            return
        }

        this.processAfterHarvest()
    }

    processHarvest() {
        let creep = this.subject
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

    processAfterHarvest() {
        let creep = this.subject
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = blueprintsHelper.taskBlueprintsOrder(this.afterHarvestTaskBlueprintsOrderList);

        let numberOfIterations = 0;

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                log('Panic! numberOfIterations was ' + numberOfIterations + ' while iterating on ' + taskBlueprints.length + ' items')
                return false
            }
            Memory.blueprintsOrderPosition.creep =  Memory.blueprintsOrderPosition.creep < taskBlueprints.length ? Memory.blueprintsOrderPosition.creep : 0
        } while (!this.processTaskBlueprint(taskBlueprints[Memory.blueprintsOrderPosition.creep++]))

        return true
    }

    processTaskBlueprint(blueprint) {
        let target;
        let targets;
        let creep = this.subject
        const roomWrapper = new RoomWrapper(creep.room);

        if (blueprint.type === TASK_TYPE_TRANSFER) {
            targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = helpers.findClosest(creep, targets);

            tc.transfer(creep, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_BUILD) {
            const myConstructionSites = roomWrapper.myConstructionSites();
            if (myConstructionSites.length === 0) {
                return false
            }

            target = helpers.findClosest(creep, myConstructionSites);

            tc.build(creep, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_UPGRADE_CONTROLLER) {
            const controller = roomWrapper.controller();
            if (!controller) {
                return false
            }
            tc.upgradeController(creep, controller.id)

            return true
        } else if (blueprint.type === TASK_TYPE_REPAIR) {
            targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = helpers.findClosest(creep, targets);

            tc.repair(creep, target.id)

            return true
        }

        return false
    }
}

class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        this.taskBlueprintsOrderList = [
            {times: 2, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50}},
            {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001}},
            {times: 1, blueprint: {type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2}},
            {times: 4, blueprint: {type: TASK_TYPE_TOWER_ATTACK}},
        ]


        let tower = this.subject
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = blueprintsHelper.taskBlueprintsOrder(this.taskBlueprintsOrderList);

        let numberOfIterations = 0;

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return false
            }
            Memory.blueprintsOrderPosition.tower =  Memory.blueprintsOrderPosition.tower < taskBlueprints.length ? Memory.blueprintsOrderPosition.tower : 0
        } while (!this.processTaskBlueprint(tower, taskBlueprints[Memory.blueprintsOrderPosition.tower++]))

        return true
    }

    processTaskBlueprint(blueprint) {
        let targets;
        let target;
        let tower = this.subject
        const roomWrapper = new RoomWrapper(tower.room);

        if (blueprint.type === TASK_TYPE_REPAIR) {
            targets = blueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = helpers.findClosest(tower, targets);

            tc.repair(tower, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_TOWER_ATTACK) {
            targets = roomWrapper.hostileCreeps();
            if (targets.length === 0) {
                return false
            }

            target = helpers.findClosest(tower, targets);

            tc.towerAttack(tower, target.id)

            return true
        }

        return false
    }
}

module.exports = {
    process: function() {
        for (let name in Game.spawns) {
            const spawn = Game.spawns[name];
            (new SpawnTaskProcessor(spawn)).process()
        }
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.spawning) {
                continue
            }
            (new CreepTaskProcessor(creep)).process()
        }
        for (let name in Game.structures) {
            const structure = Game.structures[name];
            if (!(structure instanceof StructureTower)) {
                continue
            }

            (new TowerTaskProcessor(structure)).process()
        }
    },
};