const {TaskSpawnCreep} = require("../../tasks");
const {RoomConfig} = require("../../rooms_config");
const {RoomWrapper} = require("../../wrappers");
const {TaskRenewCreep} = require("../../tasks");
const {BaseTaskProcessor} = require("./base");
const {SpawnWrapper} = require("../../wrappers");

module.exports.SpawnTaskProcessor = class SpawnTaskProcessor extends BaseTaskProcessor {
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