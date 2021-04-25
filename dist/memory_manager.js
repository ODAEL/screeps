module.exports.MemoryManager = {
    init: () => {
        Memory.tasks = Memory.tasks || []
    },
    cleanUpTasks: () => {
        let tasksCleared = 0;
        for (let i = 0; i < Memory.tasks.length; i++) {
            if (!Game.getObjectById(Memory.tasks[i].subjectId)) {
                tasksCleared++
                Memory.tasks.splice(i--, 1);
            }
        }
        
        log(tasksCleared + ' tasks was cleared')
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