const {Config} = require("./custom/config");

class RoomConfig {
    constructor(roomName) {
        this.config = Config.roomsConfig[roomName] || {}
    }

    creepRoleData(creepRole) {
        let creepRoleData = this.config.creepsRoleData && (this.config.creepsRoleData[creepRole] || this.config.creepsRoleData['default'])
        return {...Config.defaultCreepRoleData, ...(creepRoleData ? creepRoleData : {})};
    }

    towerRoleData(towerRole) {
        let towerRoleData = this.config.towersRoleData && (this.config.towersRoleData[towerRole] || this.config.towersRoleData['default'])
        return {...Config.defaultTowerRoleData, ...(towerRoleData ? towerRoleData : {})};
    }

    linkRoleData(linkRole) {
        let linkRoleData = this.config.linksRoleData && (this.config.linksRoleData[linkRole] || this.config.linksRoleData['default'])
        return {...Config.defaultLinkRoleData, ...(linkRoleData ? linkRoleData : {})};
    }

    neededCreepRoles(currentCreeps, deb = false) {
        let currentCreepRoles = _.reduce(currentCreeps, (result, creep) => {
            let role = creep.memory.role || 'default'
            result[role] = result[role] || 0
            result[role]++
            return result
        }, {})
        deb && cl(currentCreepRoles)

        let configRoles = _.keys(this.config.creepsRoleData || {})
        if (configRoles.length === 0) {
            configRoles = ['default']
        }
        deb && cl(configRoles)

        let configCreepRoles = _.reduce(configRoles, (result, role) => {
            let creepRoleData = this.creepRoleData(role)
            result[role] = creepRoleData.count
            return result
        }, {})
        deb && cl(configCreepRoles)

        let neededCreepRoles = _.reduce(configCreepRoles, (result, count, role) => {
            result[role] = _.max([0, count - (currentCreepRoles[role] || 0)])
            return result
        }, {})
        deb && cl(neededCreepRoles)

        return _.reduce(neededCreepRoles, (result, count, role) => {
            return [...result, ..._.times(count, () => role)]
        }, [])
    }
}

module.exports.RoomConfig = RoomConfig;
