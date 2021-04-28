const {RoomConfig} = require("./rooms_config");
const {TaskRenewCreep} = require("./tasks");
const {TaskSpawnCreep} = require("./tasks");
const {Task} = require("./tasks");
const {Helpers} = require("./helpers");
const {MemoryManager} = require("./memory_manager");
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

        let creepRole
        if (neededCreepRoles.indexOf('default') !== -1) {
            creepRole = 'default'
        } else {
            creepRole = neededCreepRoles[[_.random(0, neededCreepRoles.length - 1)]]
        }

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
        let creep = this.subject
        if (MemoryManager.creepMemory(creep).automated === false) {
            return null;
        }

        const role = MemoryManager.creepMemory(creep).role
        const blueprints = (new RoomConfig(creep.room.name)).creepRoleData(role).blueprints

        return blueprints.chooseTask(creep);
    }
}

class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let tower = this.subject

        const role = MemoryManager.towerMemory(tower).role || 'default'
        const blueprints = (new RoomConfig(tower.room.name)).towerRoleData(role).blueprints

        return blueprints.chooseTask(tower)
    }
}

class LinkTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let link = this.subject

        const role = MemoryManager.linkMemory(link).role || 'default'
        const blueprints = (new RoomConfig(link.room.name)).linkRoleData(role).blueprints

        return blueprints.chooseTask(link)
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
