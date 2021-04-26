module.exports.Helpers = {
    // smthByParam
    objectByParam: (objectParam, withLogIfNotFound = false) => {
        let objectById;
        const object =
            (objectParam instanceof Object && objectParam) ||
            ((objectById = Game.getObjectById(objectParam)) && objectById instanceof Object && objectById);

        if (withLogIfNotFound && !object) {
            log('Unable to find object by param=' + objectParam)
        }
            
        return object ? object : null
    },
    roomByParam: (roomParam, withLogIfNotFound = false) => {
        let roomById, roomByName;
        const room =
            (roomParam instanceof Room && roomParam) ||
            ((roomById = Game.getObjectById(roomParam)) && roomById instanceof Room && roomById) ||
            ((roomByName = Game.rooms[roomParam]) && roomByName);

        if (withLogIfNotFound && !room) {
            log('Unable to find room by param=' + roomParam)
        }
            
        return room ? room : null
    },
    sourceByParam: (sourceParam, withLogIfNotFound = false) => {
        let sourceById;
        const source =
            (sourceParam instanceof Source && sourceParam) ||
            ((sourceById = Game.getObjectById(sourceParam)) && sourceById instanceof Source && sourceById);

        if (withLogIfNotFound && !source) {
            log('Unable to find source by param=' + sourceParam)
        }
            
        return source ? source : null
    },
    spawnByParam: (spawnParam, withLogIfNotFound = false) => {
        let spawnById, spawnByName;
        const spawn =
            (spawnParam instanceof StructureSpawn && spawnParam) ||
            ((spawnById = Game.getObjectById(spawnParam)) && spawnById.structureType === STRUCTURE_SPAWN && spawnById) ||
            ((spawnByName = Game.spawns[spawnParam]) && spawnByName);

        if (withLogIfNotFound && !spawn) {
            log('Unable to find spawn by param=' + spawnParam)
        }
            
        return spawn ? spawn : null
    },
    creepByParam: (creepParam, withLogIfNotFound = false) => {
        let creepById, creepByName;
        const creep =
            (creepParam instanceof Creep && creepParam) ||
            ((creepById = Game.getObjectById(creepParam)) && creepById instanceof Creep && creepById) ||
            ((creepByName = Game.creeps[creepParam]) && creepByName);

        if (withLogIfNotFound && !creep) {
            log('Unable to find creep by param=' + creepParam)
        }
            
        return creep ? creep : null
    },
    structureByParam: (structureParam, withLogIfNotFound = false) => {
        let structureById, structureByName;
        const structure =
            (structureParam instanceof Structure && structureParam) ||
            ((structureById = Game.getObjectById(structureParam)) && structureById instanceof Structure && structureById) ||
            ((structureByName = Game.creeps[structureParam]) && structureByName);

        if (withLogIfNotFound && !structure) {
            log('Unable to find structure by param=' + structureParam)
        }
            
        return structure ? structure : null
    },
    controllerByParam: (controllerParam, withLogIfNotFound = false) => {
        let controllerById;
        const controller =
            (controllerParam instanceof StructureController && controllerParam) ||
            ((controllerById = Game.getObjectById(controllerParam)) && controllerById instanceof StructureController && controllerById);

        if (withLogIfNotFound && !controller) {
            log('Unable to find controller by param=' + controllerParam)
        }
            
        return controller ? controller : null
    },
    constructionSiteByParam: (constructionSiteParam, withLogIfNotFound = false) => {
        let constructionSiteById;
        const constructionSite =
            (constructionSiteParam instanceof ConstructionSite && constructionSiteParam) ||
            ((constructionSiteById = Game.getObjectById(constructionSiteParam)) && constructionSiteById instanceof ConstructionSite && constructionSiteById);

        if (withLogIfNotFound && !constructionSite) {
            log('Unable to find construction site by param=' + constructionSiteParam)
        }
            
        return constructionSite ? constructionSite : null
    },
    
    
    findClosest: (fromObject, toObjects) => {
        if (toObjects.length === 0) {
            return null
        }
        
        if (toObjects.length === 1) {
            return toObjects[0]
        }
        
        // TODO Change to findClosestByRange for CPU-save mode
        return fromObject.pos.findClosestByPath(toObjects)
    },
};
