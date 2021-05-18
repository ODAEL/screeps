const {BlueprintContainerProcessor} = require("../../blueprints/container_processor");
const {RoomConfig} = require("../../rooms_config");
const {BaseTaskProcessor} = require("./base");

module.exports.LinkTaskProcessor = class LinkTaskProcessor extends BaseTaskProcessor {
    processNewTasks() {
        let link = this.subject

        const role = link.memory.role || 'default'
        const blueprints = (new RoomConfig(link.room.name)).linkRoleData(role).blueprints

        return (new BlueprintContainerProcessor(link)).process(blueprints);
    }
};
