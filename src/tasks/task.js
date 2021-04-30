module.exports.Task = class Task {
    constructor(subjectId, type) {
        this.id = Game.time + '_' + Math.abs(Math.random() * 2e8 | 0)
        this.subjectId = subjectId
        this.type = type
    }

    run() {
        Log.error('Not implemented')

        return false
    }

    getObjectById(id) {
        const object = Game.getObjectById(id);
        if (!object) {
            Log.error('Unable to find object by id=' + id)
        }

        return object
    }
}
