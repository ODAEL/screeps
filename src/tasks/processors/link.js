const {RoomConfig} = require("../../rooms_config");
const {BaseTaskProcessor} = require("./base");
module.exports.LinkTaskProcessor = class LinkTaskProcessor extends BaseTaskProcessor {
    processNewTask() {
        let link = this.subject

        const role = link.memory.role || 'default'
        const blueprints = (new RoomConfig(link.room.name)).linkRoleData(role).blueprints

        return blueprints.chooseTask(link)
    }
}
