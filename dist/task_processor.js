const {RoomConfig} = require("./rooms_config");
const {TaskRenewCreep} = require("./tasks");
const {TaskSpawnCreep} = require("./tasks");
const {Task} = require("./tasks");
const {Helpers} = require("./helpers");
const {MemoryManager} = require("./memory_manager");
const {BlueprintManager} = require("./blueprints");
const {SpawnWrapper} = require("./wrappers");
const {RoomWrapper} = require("./wrappers");

class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        let task = this.currentTask(this.subject);
        if (task) {
            // If not finished
            if (this.runTask(task)) {
                return;
            }
        }

        // If finished or no current task
        task = this.processNewTask()
        if (!task) {
            return;
        }

        MemoryManager.pushTask(task);

        // TODO Revise if I can run next task after previous
        this.runTask(task);
    }

    runTask(task) {
        if (!task) {
            return false
        }

        if (!task.run()) {
            // If finished - destroy
            MemoryManager.destroyTask(task)

            return false
        }

        return true
    }

    currentTask(subjectParam) {
        const subject = Helpers.objectByParam(subjectParam)

        for (let task of MemoryManager.tasks()) {
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

        let task = this.processSpawnCreep()
        if (task) {
            return task;
        }

        const spawnWrapper = new SpawnWrapper(spawn);
        const myCreepsNear = spawnWrapper.myCreepsNear((object) => {
            return object.ticksToLive < 800
        });

        if (myCreepsNear.length > 0) {
            // TODO Not renew low-level creeps
            return new TaskRenewCreep(spawn, myCreepsNear[0]);
        }

        return null
    }

    processSpawnCreep() {
        let spawn = this.subject
        if (spawn.spawning) {
            return null;
        }

        const roomWrapper = new RoomWrapper(spawn.room);
        const roomConfig = new RoomConfig(spawn.room.name)

        const neededCreepRoles = roomConfig.neededCreepRoles(roomWrapper.myCreeps())
        if (neededCreepRoles.length === 0) {
            return null;
        }

        const creepRole = neededCreepRoles[[_.random(0, neededCreepRoles.length - 1)]]

        const creepRoleData = roomConfig.creepRoleData(creepRole)
        let optimalBodyparts = creepRoleData.optimalBodyparts
        if (roomWrapper.myCreeps().length === 0) {
            optimalBodyparts = [WORK, CARRY, MOVE]
        }

        return new TaskSpawnCreep(
            spawn,
            {
                optimalBodyparts: optimalBodyparts,
                role: creepRole,
            }
        );
    }
}

class CreepTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        if (MemoryManager.creepMemory(this.subject).automated === false) {
            return null;
        }

        let harvestTask = this.processHarvest();
        if (harvestTask) {
            return harvestTask;
        }

        return this.processAfterHarvest();
    }

    processHarvest() {
        let creep = this.subject
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
            return null
        }

        const role = MemoryManager.creepMemory(creep).role
        const taskBlueprints = (new RoomConfig(creep.room.name)).creepRoleData(role).harvestTaskBlueprints

        let numberOfIterations = 0;
        let task
        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return null
            }

            task = BlueprintManager.taskByBlueprint(creep, taskBlueprints[MemoryManager.blueprintsOrderPosition('creep.harvest.' + creep.id, taskBlueprints.length)])

        } while (!task)

        return task
    }

    processAfterHarvest() {
        let creep = this.subject
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return null
        }

        const role = MemoryManager.creepMemory(creep).role
        const taskBlueprints = (new RoomConfig(creep.room.name)).creepRoleData(role).afterHarvestTaskBlueprints

        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return null
            }

            task = BlueprintManager.taskByBlueprint(creep, taskBlueprints[MemoryManager.blueprintsOrderPosition('creep.afterHarvest.' + creep.id, taskBlueprints.length)])

        } while (!task)

        return task
    }
}

class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let tower = this.subject
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return null
        }

        const role = MemoryManager.towerMemory(tower).role || 'default'
        const taskBlueprints = (new RoomConfig(tower.room.name)).towerRoleData(role).taskBlueprints

        if (taskBlueprints.length === 0) {
            return null
        }

        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return null
            }
            task = BlueprintManager.taskByBlueprint(tower, taskBlueprints[MemoryManager.blueprintsOrderPosition('tower', taskBlueprints.length)])
        } while (!task)

        return task
    }
}

class LinkTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let link = this.subject
        if (link.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return null
        }

        const role = MemoryManager.linkMemory(link).role || 'default'
        const taskBlueprints = (new RoomConfig(link.room.name)).linkRoleData(role).taskBlueprints

        if (taskBlueprints.length === 0) {
            return null
        }

        let numberOfIterations = 0;
        let task
        do {
            if (numberOfIterations++ > taskBlueprints.length) {
                return null
            }

            task = BlueprintManager.taskByBlueprint(link, taskBlueprints[MemoryManager.blueprintsOrderPosition('link.' + link.id, taskBlueprints.length)])

        } while (!task)

        return task
    }
}

module.exports.TaskProcessor = {
    process: function () {
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
        for (let name in Game.structures) {
            const structure = Game.structures[name];
            if (!(structure instanceof StructureLink)) {
                continue
            }

            (new LinkTaskProcessor(structure)).process()
        }
    },
};
