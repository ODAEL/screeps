const {SpawnWrapper} = require("./wrappers");
const {SourceWrapper} = require("./wrappers");
const {RoomWrapper} = require("./wrappers");
const {BlueprintsHelper} = require("./helper.blueprints");
const {Helpers} = require("./helpers");
const {TaskController} = require("./task_controller");

class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        let task = TaskController.currentTask(this.subject);
        if (!task) {
            this.processNewTask();
            task = TaskController.currentTask(this.subject);
        }

        TaskController.runTask(task);
    }

    processNewTask() {}
}

class SpawnTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let spawn = this.subject
        const roomWrapper = new RoomWrapper(spawn.room);
        if (roomWrapper.availableHarvestPos().length + 1 > roomWrapper.myCreeps().length &&
            (roomWrapper.myCreeps().length === 0 || (roomWrapper.energyCapacityAvailable() === roomWrapper.energyAvailable()))) {
            TaskController.spawnCreep(spawn)

            return;
        }

        const spawnWrapper = new SpawnWrapper(spawn);
        const myCreepsNear = spawnWrapper.myCreepsNear((object) => {
            return object.ticksToLive < 800
        });
        if (myCreepsNear.length > 0) {
            TaskController.renewCreep(spawn, myCreepsNear[0])

            return;
        }
    }
}

class CreepTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
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

        const source = Helpers.findClosest(creep, sources);
        TaskController.harvest(creep, source.id)

        return true
    }

    processAfterHarvest() {
        let creep = this.subject
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = [
            ..._.times(8, () => ({type: TASK_TYPE_TRANSFER, structureTypes: [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], my: true, maxFreeCapacityEnergy: 0})),
            ..._.times(1, () => ({type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_TOWER, my: true, maxFreeCapacityEnergy: 0})),
            ..._.times(1, () => ({type: TASK_TYPE_TRANSFER, structureTypes: STRUCTURE_CONTAINER, maxFreeCapacityEnergy: 0})),
            ..._.times(1, () => ({type: TASK_TYPE_UPGRADE_CONTROLLER})),
            ..._.times(3, () => ({type: TASK_TYPE_BUILD})),
            ..._.times(1, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50})),
            ..._.times(1, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001})),
            ..._.times(1, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2})),
        ]

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
            targets = BlueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = Helpers.findClosest(creep, targets);

            TaskController.transfer(creep, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_BUILD) {
            const myConstructionSites = roomWrapper.myConstructionSites();
            if (myConstructionSites.length === 0) {
                return false
            }

            target = Helpers.findClosest(creep, myConstructionSites);

            TaskController.build(creep, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_UPGRADE_CONTROLLER) {
            const controller = roomWrapper.controller();
            if (!controller) {
                return false
            }
            TaskController.upgradeController(creep, controller.id)

            return true
        } else if (blueprint.type === TASK_TYPE_REPAIR) {
            targets = BlueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = Helpers.findClosest(creep, targets);

            TaskController.repair(creep, target.id)

            return true
        }

        return false
    }
}

class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let tower = this.subject
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = [
            ..._.times(2, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_ROAD, minHitPercentage: 0.50})),
            ..._.times(1, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_WALL, minHitPercentage: 0.000001})),
            ..._.times(1, () => ({type: TASK_TYPE_REPAIR, structureTypes: STRUCTURE_CONTAINER, minHitPercentage: 0.2})),
            ..._.times(4, () => ({type: TASK_TYPE_TOWER_ATTACK})),
        ]

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
            targets = BlueprintsHelper.getStructuresByBlueprint(roomWrapper, blueprint);
            if (targets.length === 0) {
                return false
            }

            target = Helpers.findClosest(tower, targets);

            TaskController.repair(tower, target.id)

            return true
        } else if (blueprint.type === TASK_TYPE_TOWER_ATTACK) {
            targets = roomWrapper.hostileCreeps();
            if (targets.length === 0) {
                return false
            }

            target = Helpers.findClosest(tower, targets);

            TaskController.towerAttack(tower, target.id)

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