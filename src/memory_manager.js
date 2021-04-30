const cleanUpObjectsMemory = () => {
    cleanUpBuiltInMemory('spawns');
    cleanUpBuiltInMemory('creeps');
    cleanUpCustomMemory('towers');
    cleanUpCustomMemory('links');
};

const cleanUpBuiltInMemory = (memoryKey) => {
    let objectsCleared = 0;
    for (let name in Memory[memoryKey]) {
        if (!Game[memoryKey][name]) {
            objectsCleared++
            delete Memory[memoryKey][name];
        }
    }

    Log.info(objectsCleared + ' ' + memoryKey + ' was cleared')
};

const cleanUpCustomMemory = (memoryKey) => {
    let objectsCleared = 0;
    for (let id in Memory[memoryKey]) {
        if (!Game.getObjectById(id)) {
            objectsCleared++
            delete Memory[memoryKey][id];
        }
    }

    Log.info(objectsCleared + ' ' + memoryKey + ' was cleared')
};

module.exports.MemoryManager = {
    cleanUp: () => {
        cleanUpObjectsMemory();
    },
};
