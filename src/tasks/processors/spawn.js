const {TaskSpawnCreep} = require("../spawn_creep");
const {TaskRenewCreep} = require("../renew_creep");
const {RoomConfig} = require("../../rooms_config");
const {RoomWrapper} = require("../../wrappers");
const {BaseTaskProcessor} = require("./base");
const {SpawnWrapper} = require("../../wrappers");

module.exports.SpawnTaskProcessor = class SpawnTaskProcessor extends BaseTaskProcessor {
    processNewTasks() {
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
            return new TaskRenewCreep(myCreepsNear[0]);
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

        let automated = creepRoleData.automated
        if (automated === undefined) {
            automated = true
        }

        let initialTasks = creepRoleData.initialTasks
        if (!initialTasks) {
            initialTasks = []
        }

        return new TaskSpawnCreep(
            {
                optimalBodyparts: optimalBodyparts,
                role: creepRole,
                automated: automated,
                initialTasks: initialTasks,
            }
        );
    }
};
