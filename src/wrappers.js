const {MemoryManager} = require("./memory_manager");
const {Helpers} = require("helpers");

class RoomWrapper {
    constructor(roomParam) {
        const room = Helpers.roomByParam(roomParam);

        if (!room) {
            log('Unable to find source by roomParam=' + roomParam)
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
                const nearestHostileWithAttack = (new SourceWrapper(object)).nearestHostileWithAttack();

                return (!nearestHostileWithAttack || !nearestHostileWithAttack.pos.inRangeTo(object, 3)) &&
                    this.checkFilter(filter, object)
            }
        )
    }

    currentAvailableSources(filter) {
        return this.availableSources(
            (object) => {
                const sourceWrapper = new SourceWrapper(object);

                return (sourceWrapper.availableHarvestPos().length > sourceWrapper.connectedCreeps().length) &&
                    this.checkFilter(filter, object)
            }
        )
    }

    availableHarvestPos() {
        const availableHarvestPos = [];

        const sources = this.availableSources();
        for (let source of sources) {
            availableHarvestPos.push(...(new SourceWrapper(source)).availableHarvestPos())
        }

        return availableHarvestPos
    }

    constructionSites(filter) {
        return this.find(FIND_CONSTRUCTION_SITES, filter)
    }

    creeps(filter) {
        return this.find(FIND_CREEPS, filter)
    }

    myCreeps(filter) {
        return this.find(FIND_MY_CREEPS, filter)
    }

    hostileCreeps(filter) {
        return this.find(FIND_HOSTILE_CREEPS, filter)
    }

    structures(filter) {
        return this.find(FIND_STRUCTURES, filter)
    }

    minerals(filter) {
        return this.find(FIND_MINERALS, filter)
    }

    tombstones(filter) {
        return this.find(FIND_TOMBSTONES, filter)
    }

    droppedResources(filter) {
        return this.find(FIND_DROPPED_RESOURCES, filter)
    }

    controller() {
        return this.room.controller
    }

    energyCapacityAvailable() {
        return this.room.energyCapacityAvailable
    }

    energyAvailable() {
        return this.room.energyAvailable
    }
}

class SourceWrapper {
    constructor(sourceParam) {
        const source = Helpers.sourceByParam(sourceParam);

        if (!source) {
            log('Unable to find source by sourceParam=' + sourceParam)
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
        for (let task of MemoryManager.tasks()) {
            let subject = Game.getObjectById(task.subjectId)
            if (subject && task.sourceId && task.sourceId === this.source.id) {
                connectedCreeps.push(subject)
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
}

class SpawnWrapper {
    constructor(spawnParam) {
        const spawn = Helpers.spawnByParam(spawnParam);

        if (!spawn) {
            log('Unable to find spawn by spawnParam=' + spawnParam)
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

module.exports.RoomWrapper = RoomWrapper
module.exports.SourceWrapper = SourceWrapper
module.exports.SpawnWrapper = SpawnWrapper
