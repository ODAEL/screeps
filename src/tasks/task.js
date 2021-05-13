module.exports.Task = class Task {
    constructor(type) {
        this.id = Game.time + '_' + Math.abs(Math.random() * 2e8 | 0)
        this.type = type
    }

    run(subject) {
        Log.error('Not implemented')

        return false
    }

    continue() {
        return true
    }

    finish() {
        return false
    }
}
