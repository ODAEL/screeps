const generateRoomConstructionBlueprint = function (roomName, filterStructures = [STRUCTURE_WALL, STRUCTURE_ROAD, STRUCTURE_RAMPART]) {
    let room = Game.rooms[roomName];

    let config = {};
    let structures = room.find(FIND_STRUCTURES);
    for (let structure of structures) {
        let type = structure.structureType
        if (!filterStructures.includes(type)) {
            continue;
        }

        if (_.isUndefined(config[type])) {
            config[type] = [];
        }

        config[type].push({x: structure.pos.x, y: structure.pos.y});
    }

    return config;
};

module.exports.ConstructUtils = {
    generateRoomConstructionBlueprint: generateRoomConstructionBlueprint
};
