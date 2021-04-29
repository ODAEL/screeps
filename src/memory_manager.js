const cleanUpTasks = () => {
    let tasksCleared = 0;
    for (let i = 0; i < Memory.tasks.length; i++) {
        if (!Game.getObjectById(Memory.tasks[i].subjectId)) {
            tasksCleared++
            Memory.tasks.splice(i--, 1);
        }
    }

    log(tasksCleared + ' tasks was cleared')
};

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

    log(objectsCleared + ' ' + memoryKey + ' was cleared')
};

const cleanUpCustomMemory = (memoryKey) => {
    let objectsCleared = 0;
    for (let id in Memory[memoryKey]) {
        if (!Game.getObjectById(id)) {
            objectsCleared++
            delete Memory[memoryKey][id];
        }
    }

    log(objectsCleared + ' ' + memoryKey + ' was cleared')
};

module.exports.MemoryManager = {
    init: () => {
        Memory.tasks = Memory.tasks || []
    },
    cleanUp: () => {
        cleanUpTasks();
        cleanUpObjectsMemory();
    },

    tasks: () => {
        return Memory.tasks
    },
    pushTask: (task) => {
        Memory.tasks.push(task)
    },
    destroyTask: (task) => {
        for (let i = 0; i < Memory.tasks.length; i++) {
            if (Memory.tasks[i].id === task.id) {
                Memory.tasks.splice(i, 1);
                return
            }
        }
    },


    blueprintsOrderPosition: (key, max) => {
        Memory.blueprintsOrderPosition = Memory.blueprintsOrderPosition || {}

        let position = Memory.blueprintsOrderPosition[key] || 0
        position =  (position < max) ? position : 0

        Memory.blueprintsOrderPosition[key] = position + 1
        return position
    }
};
