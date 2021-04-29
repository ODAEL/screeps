const {MemoryManager} = require("../../memory_manager");
module.exports.BaseTaskProcessor = class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        let task = this.subject.currentTask;
        if (task) {
            // If not finished
            if (this.runTask(task)) {
                return;
            }
        }

        // If finished or no current tasks
        task = this.processNewTask()
        if (!task) {
            return;
        }

        this.subject.tasks.push(task);

        // TODO Revise if I can run next tasks after previous
        this.runTask(task);
    }

    runTask(task) {
        if (!task) {
            return false
        }

        if (!task.run()) {
            // If finished - destroy
            MemoryManager.destroyTask(task)

            return false
        }

        return true
    }

    processNewTask() {
    }
};
