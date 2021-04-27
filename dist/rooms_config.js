const {MemoryManager} = require("./memory_manager");
const {__} = require("./filters");
const {Filters} = require("./filters");
const {Blueprint} = require("./blueprints");

const config = {
    'E33N38': {
        creepsRoleData: {
            'default': {
                count: 5,
            },
            'harvester_right_1': {
                optimalBodyparts: [
                    ..._.times(10, () => WORK),
                    ..._.times(6, () => CARRY),
                    ..._.times(1, () => MOVE),
                ],
                harvestTaskBlueprints: [
                    Blueprint.harvest([Filters.id('5bbcaeda9099fc012e639a7e')]),
                ],
                afterHarvestTaskBlueprints: [
                    Blueprint.transfer([Filters.id('6081b75c41d68bc69620415b')])
                ]
            },
        },
    },
};

const defaultCreepRoleData = {
    count: 1,
    optimalBodyparts: [
        ..._.times(7, () => WORK),
        ..._.times(7, () => CARRY),
        ..._.times(7, () => MOVE),
    ],
    harvestTaskBlueprints: [
        Blueprint.harvest(),
    ],
    afterHarvestTaskBlueprints: [
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
        return {...defaultCreepRoleData, ...(creepRoleData ? creepRoleData : {})};
    }

    neededCreepRoles(currentCreeps) {
        let currentCreepRoles = _.reduce(currentCreeps, (result, creep) => {
            let creepMemory = MemoryManager.creepMemory(creep)
            let role = creepMemory.role || 'default'
            result[role] = result[role] || 0
            result[role]++
            return result
        }, {})

        let configRoles = _.keys(this.config.creepsRoleData || {})
        if (configRoles.length === 0) {
            configRoles = ['default']
        }

        let configCreepRoles = _.reduce(configRoles, (result, role) => {
            let creepRoleData = this.creepRoleData(role)
            result[role] = creepRoleData.count
            return result
        }, {})

        let neededCreepRoles = _.reduce(configCreepRoles, (result, count, role) => {
            result[role] = _.max([0, count - currentCreepRoles[role]])
            return result
        }, {})

        return _.reduce(neededCreepRoles, (result, count, role) => {
            return [...result, ..._.times(count, () => role)]
        }, [])
    }
}

module.exports.RoomConfig = RoomConfig;
