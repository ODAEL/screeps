class RoomWrapper {
    constructor(roomParam) {
        var room = helpers.roomByParam(roomParam)
        
        if (!room) {
            debug('Unable to find source by roomParam=' + roomParam)
        }
        
        this.room = room
    }
    
    checkFilter(filter, object) {
        return !filter || filter(object)
    }
    
    find(type, filter) {
        return this.room.find(type, filter ? {filter: filter} : {})
    }
    
    activeSources(filter) {
        return this.find(FIND_SOURCES_ACTIVE, filter)
    }
    
    availableSources(filter) {
        return this.activeSources(
            (object) => {
                var nearestHostileWithAttack = (new SourceWrapper(object)).nearestHostileWithAttack()
                
                return (!nearestHostileWithAttack || !nearestHostileWithAttack.pos.inRangeTo(object, 3)) &&
                    this.checkFilter(filter, object)
            }
        )
    }
    
    availableHarvestPos() {
        var availableHarvestPos = []
        
        var sources = this.availableSources()
        for (var source of sources) {
            availableHarvestPos.push(...(new SourceWrapper(source)).availableHarvestPos())
        }
        
        return availableHarvestPos
    }
    
    myConstructionSites() {
        return this.room.find(FIND_MY_CONSTRUCTION_SITES)
    }
    
    myCreeps() {
        return this.room.find(FIND_MY_CREEPS)
    }
    
    hostileCreeps() {
        return this.room.find(FIND_HOSTILE_CREEPS)
    }
    
    myStructures(filter) {
        return this.find(FIND_MY_STRUCTURES, filter)
    }
    
    myStructuresWithStore(filter) {
        return this.myStructures(
            (object) => {
                return (object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_EXTENSION) &&
                    object.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                    this.checkFilter(filter, object)
            }
        )
    }
    
    structures(filter) {
        return this.find(FIND_STRUCTURES, filter)
    }
    
    walls(filter) {
        return this.structures( 
            (object) => {
                return object.structureType == STRUCTURE_WALL &&
                    this.checkFilter(filter, object)
            }
        )
    }
    
    roads(filter) {
        return this.structures( 
            (object) => {
                return object.structureType == STRUCTURE_ROAD &&
                    this.checkFilter(filter, object)
            }
        )
    }
    
    controller() {
        return this.room.controller
    }
    
    energyCapasityAvailable() {
        return this.room.energyCapacityAvailable
    }
    
    energyAvailable() {
        return this.room.energyAvailable
    }
}

module.exports = RoomWrapper