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
            if (this.runTask(task)) {
                Log.debug(this.subject, 'Continue task')
                return;
            }
            Log.debug(this.subject, 'Task is finished')
        }

        Log.debug(this.subject, 'Process new task')
        // If finished or no current tasks
        task = this.processNewTask()
        if (!task) {
            Log.debug(this.subject, 'New task not chosen')
            return;
        }

        Log.debug(this.subject, 'New task chosen', task)
        this.subject.tasks.push(task);

        Log.debug(this.subject, 'Current tasks', this.subject.tasks)
        // TODO Revise if I can run next tasks after previous
        this.runTask(task);
    }

    runTask(task) {
        if (!task) {
            return false
        }

        if (!task.run()) {
            // If finished - end
            this.subject.endCurrentTask()

            return false
        }

        return true
    }

    processNewTask() {
    }
};
