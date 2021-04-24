const processSpawn = (spawn) => {
    if (tc.runSpawn(spawn)) {
        return
    }

    processSpawnNewTask(spawn)

    tc.runSpawn(spawn)
};

var processSpawnNewTask = (spawn) => {
    const roomWrapper = new RoomWrapper(spawn.room);
    if (roomWrapper.availableHarvestPos().length + 1 > roomWrapper.myCreeps().length &&
        (roomWrapper.myCreeps().length === 0 || (roomWrapper.energyCapasityAvailable() === roomWrapper.energyAvailable()))) {
        tc.spawnCreep(spawn)
        
        return
    }

    const spawnWrapper = new SpawnWrapper(spawn);
    const myCreepsNear = spawnWrapper.myCreepsNear((object) => {
        return object.ticksToLive < 800
    });
    if (myCreepsNear.length > 0) {
        tc.renewCreep(spawn, myCreepsNear[0])
        
        return
    }
}

module.exports = {
    process: () => {
        for (let name in Game.spawns) {
            const spawn = Game.spawns[name];
            processSpawn(spawn)
        }
    }
};