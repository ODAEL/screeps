const {BaseTaskProcessor} = require("./base");
const {RoomConfig} = require("../../rooms_config");
module.exports.TowerTaskProcessor = class TowerTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let tower = this.subject

        const role = tower.memory.role || 'default'
        const blueprints = (new RoomConfig(tower.room.name)).towerRoleData(role).blueprints

        return blueprints.chooseTask(tower)
    }
}