module.exports = {
    cleanUpTasks: () => {
        var tasksCleared = 0
        for (var i = 0; i < Memory.tasks.length; i++) {
            if (!Game.getObjectById(Memory.tasks[i].subjectId)) {
                tasksCleared++
                Memory.tasks.splice(i--, 1);
            }
        }
        
        log(tasksCleared + ' tasks was cleared')
    }
};