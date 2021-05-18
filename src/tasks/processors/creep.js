const {BlueprintContainerProcessor} = require("../../blueprints/container_processor");
const {RoomConfig} = require("../../rooms_config");
const {BaseTaskProcessor} = require("./base");

module.exports.CreepTaskProcessor = class CreepTaskProcessor extends BaseTaskProcessor {
    processNewTasks() {
        let creep = this.subject
        if (creep.memory.automated === false) {
            return null;
        }

        const role = creep.memory.role
        const blueprints = (new RoomConfig(creep.room.name)).creepRoleData(role).blueprints

        return (new BlueprintContainerProcessor(creep)).process(blueprints);
    }
};
