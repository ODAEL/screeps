class SpawnWrapper {
    constructor(spawnParam) {
        const spawn = helpers.spawnByParam(spawnParam);

        if (!spawn) {
            debug('Unable to find spawn by spawnParam=' + spawnParam)
        }
        
        this.spawn = spawn
    }
    
    myCreepsNear(filter) {
        const myCreepsNear = [];
        const spawnPos = this.spawn.pos;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue
                }

                const nearPos = new RoomPosition(spawnPos.x + i, spawnPos.y + j, spawnPos.roomName);
                const creeps = nearPos.lookFor(LOOK_CREEPS);
                if (creeps.length === 0) {
                    continue
                }

                const creep = creeps[0];
                if (creep.my === false) {
                    continue
                }
                
                if (filter && !filter(creep)) {
                    continue
                }
                
                myCreepsNear.push(creep)
            }
        }
        
        return myCreepsNear
    }
}

module.exports = SpawnWrapper