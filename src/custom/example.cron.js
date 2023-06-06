const {RoomConstructionConfig} = require("./room_construction_config");
module.exports = () => {
    if (Game.time % 100 === 0) {
        Log.info('Hello world')
    }

    if (Game.time % 100 === 0) {
        for (let roomName in RoomConstructionConfig) {
            RoomConstructionConfig[roomName].construct(roomName);
        }
    }
}
