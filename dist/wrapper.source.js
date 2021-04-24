class SourceWrapper {
    constructor(sourceParam) {
        var source = helpers.sourceByParam(sourceParam)
        
        if (!source) {
            debug('Unable to find source by sourceParam=' + sourceParam)
        }
        
        this.source = source
    }
    
    availableHarvestPos() {
        var terrain = new Room.Terrain(this.source.room.name)
        var availableHarvestPos = []
        var x = this.source.pos.x
        var y = this.source.pos.y
        
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j == 0 && i == 0) {
                    continue
                }
                
                if (terrain.get(x + i, y + j) != TERRAIN_MASK_WALL) {
                    availableHarvestPos.push({x: x + i, y: y + j})
                }
            }
        }
        
        return availableHarvestPos
    }
    
    connectedCreeps() {
        var connectedCreeps = []
        for (var name in Game.creeps) {
            var creep = Game.creeps[name]
            var currentTask = tc.currentCreepTask(creep)
            if (currentTask && currentTask.sourceId && currentTask.sourceId == this.source.id) {
                connectedCreeps.push(creep)
            }
        }
        
        return connectedCreeps
    }
    
    nearestHostileWithAttack() {
        return this.source.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(ATTACK) != 0;
            }
        });
    }
    
    roomWrapper() {
        return new RoomWrapper(this.source.room)
    }
}

module.exports = SourceWrapper