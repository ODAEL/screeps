const {__} = require("./filters");
const {Filters} = require("./filters");
const {Blueprint} = require("./blueprints");

let defaultCreepRoleData

let config = {
    'E33N38': {
        creepsRoleData: {
        },
    },
};

defaultCreepRoleData = {
    count: 1,
    optimalBodyparts: [
        ..._.times(7, () => WORK),
        ..._.times(7, () => CARRY),
        ..._.times(7, () => MOVE),
    ],
    taskBlueprints: [
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
    ],
};

class RoomConfig {
    constructor(roomName) {
        this.config = config[roomName] || {}
    }

    creepRoleData(creepRole) {
        let creepRoleData = this.config.creepsRoleData && this.config.creepsRoleData[creepRole]
        return _.merge(defaultCreepRoleData, creepRoleData ? creepRoleData : {});
    }
}

module.exports.RoomConfig = RoomConfig;
