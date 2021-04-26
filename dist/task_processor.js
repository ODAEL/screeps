const {TaskRenewCreep} = require("./tasks");
const {TaskSpawnCreep} = require("./tasks");
const {Task} = require("./tasks");
const {Helpers} = require("./helpers");
const {__} = require("./filters");
const {Filters} = require("./filters");
const {MemoryManager} = require("./memory_manager");
const {BlueprintManager} = require("./blueprints");
const {Blueprint} = require("./blueprints");
const {SpawnWrapper} = require("./wrappers");
const {RoomWrapper} = require("./wrappers");

class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        let task = this.currentTask(this.subject);
        if (task) {
            this.runTask(task);
            task = this.currentTask(this.subject);
        }
        if (!task) {
            this.processNewTask();
            task = this.currentTask(this.subject);
        }

        this.runTask(task);
    }

    runTask(task) {
        if (!task) {
            return false
        }

        if (!task.run()) {
            MemoryManager.destroyTask(task)

            return false
        }

        return true
    }

    currentTask(subjectParam) {
        const subject = Helpers.objectByParam(subjectParam)

        for (let task of Memory.tasks) {
            if (task.subjectId === subject.id) {
                return Task.getTaskObject(task)
            }
        }
    };

    processNewTask() {}
}

class SpawnTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let spawn = this.subject
        const roomWrapper = new RoomWrapper(spawn.room);
        if (roomWrapper.availableHarvestPos().length + 1 > roomWrapper.myCreeps().length &&
            (roomWrapper.myCreeps().length === 0 || (roomWrapper.energyCapacityAvailable() === roomWrapper.energyAvailable()))) {
            MemoryManager.pushTask(new TaskSpawnCreep(spawn))

            return;
        }

        const spawnWrapper = new SpawnWrapper(spawn);
        const myCreepsNear = spawnWrapper.myCreepsNear((object) => {
            return object.ticksToLive < 800
        });
        if (myCreepsNear.length > 0) {
            MemoryManager.pushTask(new TaskRenewCreep(spawn, myCreepsNear[0]))

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
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
            return false
        }


        let blueprint = Blueprint.harvest()

        let task = BlueprintManager.taskByBlueprint(creep, blueprint)

        if (task) {
            MemoryManager.pushTask(task)

            return true
        }

        return false
    }

    processAfterHarvest() {
        let creep = this.subject
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = [
            ..._.times(8, () => (Blueprint.transfer(
                [Filters.structureType(__.in([STRUCTURE_SPAWN, STRUCTURE_EXTENSION])), Filters.my()]
            ))),
            ..._.times(1, () => (Blueprint.transfer(
                [Filters.structureType(__.eq(STRUCTURE_TOWER)), Filters.my()]
            ))),
            ..._.times(1, () => (Blueprint.transfer(
                [Filters.structureType(__.eq(STRUCTURE_CONTAINER))]
            ))),
            ..._.times(1, () => (Blueprint.upgradeController())),
            ..._.times(3, () => (Blueprint.build())),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_ROAD)), Filters.hitsPercentage(__.lt(0.50))]
            ))),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_WALL)), Filters.hitsPercentage(__.lt(0.000001))]
            ))),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_CONTAINER)), Filters.hitsPercentage(__.lt(0.2))]
            ))),
        ]

        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                log('Panic! numberOfIterations was ' + numberOfIterations + ' while iterating on ' + taskBlueprints.length + ' items')
                return false
            }

            task = BlueprintManager.taskByBlueprint(creep, taskBlueprints[MemoryManager.blueprintsOrderPosition('creep', taskBlueprints.length)])

        } while (!task)

        MemoryManager.pushTask(task)

        return true
    }
}

class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let tower = this.subject
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const taskBlueprints = [
            ..._.times(2, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_ROAD)), Filters.hitsPercentage(__.lt(0.50))]
            ))),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_WALL)), Filters.hitsPercentage(__.lt(0.00001))]
            ))),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_CONTAINER)), Filters.hitsPercentage(__.lt(0.2))]
            ))),
            ..._.times(1, () => (Blueprint.repair(
                [Filters.structureType(__.eq(STRUCTURE_RAMPART)), Filters.hitsPercentage(__.lt(0.001))]
            ))),
            ..._.times(4, () => (Blueprint.towerAttack())),
        ]

        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return false
            }
            task = BlueprintManager.taskByBlueprint(tower, taskBlueprints[MemoryManager.blueprintsOrderPosition('tower', taskBlueprints.length)])
        } while (!task)

        MemoryManager.pushTask(task);

        return true
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