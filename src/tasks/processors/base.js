module.exports.BaseTaskProcessor = class BaseTaskProcessor {
    constructor(subject) {
        this.subject = subject;
    }

    process() {
        Log.debug(this.subject, 'BaseTaskProcessor::process')
        let task = this.subject.currentTask;
        if (task) {
            Log.debug(this.subject, 'Task found', task)
            // If not finished
            if (!this.runTask(task)) {
                Log.debug(this.subject, 'Continue or finish task')
                return;
            }
            Log.debug(this.subject, 'Task is skipped')
        }

        Log.debug(this.subject, 'Process new task')
        
        // If finished or no current tasks
        let tasks = this.processNewTasks()
        if (!tasks) {
            Log.debug(this.subject, 'New task not chosen')
            return;
        }

        if (!_.isArray(tasks)) {

            tasks = [tasks]
        }

        Log.debug(this.subject, 'New tasks chosen')

        for (let task of tasks) {
            this.subject.tasks.push(task);
        }

        Log.debug(this.subject, 'Current tasks', this.subject.tasks)
        this.runTask(this.subject.currentTask);
    }

    /**
     * @param task
     * @returns {boolean} new task needed
     */
    runTask(task) {
        if (!task) {
            return true
        }

        let runResult = task.run(this.subject)

        if (runResult === TASK_CODE_CONTINUE) {
            // If continue - new task not needed
            return false
        }

        this.subject.endCurrentTask()

        if (runResult === TASK_CODE_SKIP) {
            // If skipped - new task needed
            return true
        }

        if (runResult === TASK_CODE_FINISH) {
            // If finished - new task not needed
            return true
        }
    }

    processNewTasks() {
    }
};
