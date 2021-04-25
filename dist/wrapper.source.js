global.SourceWrapper = class SourceWrapper {
    constructor(sourceParam) {
        const source = helpers.sourceByParam(sourceParam);

        if (!source) {
            debug('Unable to find source by sourceParam=' + sourceParam)
        }
        
        this.source = source
    }
    
    availableHarvestPos() {
        const terrain = new Room.Terrain(this.source.room.name);
        const availableHarvestPos = [];
        const x = this.source.pos.x;
        const y = this.source.pos.y;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (j === 0 && i === 0) {
                    continue
                }
                
                if (terrain.get(x + i, y + j) !== TERRAIN_MASK_WALL) {
                    availableHarvestPos.push({x: x + i, y: y + j})
                }
            }
        }
        
        return availableHarvestPos
    }
    
    connectedCreeps() {
        const connectedCreeps = [];
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            const currentTask = tc.currentCreepTask(creep);
            if (currentTask && currentTask.sourceId && currentTask.sourceId === this.source.id) {
                connectedCreeps.push(creep)
            }
        }
        
        return connectedCreeps
    }
    
    nearestHostileWithAttack() {
        return this.source.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(ATTACK) !== 0;
            }
        });
    }
    
    roomWrapper() {
        return new RoomWrapper(this.source.room)
    }
}
