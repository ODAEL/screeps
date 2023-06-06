class ConstructBlueprint {
    constructor(config) {
        this.config = config
    }

    construct(roomName) {
        let room = Game.rooms[roomName]
        for (let type in this.config) {
            for (let pos of this.config[type]) {
                if (!_.isEmpty(room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y))) {
                    continue;
                }

                room.createConstructionSite(pos.x, pos.y, type);
            }
        }
    }
}

module.exports.ConstructBlueprint = ConstructBlueprint;