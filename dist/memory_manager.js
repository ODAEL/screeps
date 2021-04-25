module.exports.MemoryManager = {
    init: () => {
        Memory.tasks = Memory.tasks || []
    },
    cleanUp: () => {
        let tasksCleared = 0;
        for (let i = 0; i < Memory.tasks.length; i++) {
            if (!Game.getObjectById(Memory.tasks[i].subjectId)) {
                tasksCleared++
                Memory.tasks.splice(i--, 1);
            }
        }
        
        log(tasksCleared + ' tasks was cleared')


        let creepsCleared = 0;
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                creepsCleared++
                delete Memory.creeps[name];
            }
        }

        log(creepsCleared + ' creeps was cleared')
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
};