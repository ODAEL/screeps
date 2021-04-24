class SpawnWrapper {
    constructor(spawnParam) {
        var spawn = helpers.spawnByParam(spawnParam)
        
        if (!spawn) {
            debug('Unable to find spawn by spawnParam=' + spawnParam)
        }
        
        this.spawn = spawn
    }
    
    myCreepsNear(filter) {
        var myCreepsNear = []
        var spawnPos = this.spawn.pos
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue
                }
                
                var nearPos = new RoomPosition(spawnPos.x + i, spawnPos.y + j, spawnPos.roomName)
                var creeps = nearPos.lookFor(LOOK_CREEPS)
                if (creeps.length == 0) {
                    continue
                }
                
                var creep = creeps[0]
                if (creep.my == false) {
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