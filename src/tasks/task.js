module.exports.Task = class Task {
    constructor(type) {
        this.type = type
    }

    run(subject) {
        Log.error('Not implemented')

        return this.skip()
    }

    continue() {
        return TASK_CODE_CONTINUE
    }

    skip() {
        return TASK_CODE_SKIP
    }

    finish() {
        return TASK_CODE_FINISH
    }
}
