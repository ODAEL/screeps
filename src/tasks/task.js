module.exports.Task = class Task {
    constructor(subjectType, subjectId, type) {
        this.id = Game.time + '_' + Math.abs(Math.random() * 2e8 | 0)
        this.subjectType = subjectType
        this.subjectId = subjectId
        this.type = type
    }

    run() {
        log('Not implemented')

        return false
    }

    getObjectById(id) {
        const object = Game.getObjectById(id);
        if (!object) {
            log('Unable to find object by id=' + id)
        }

        return object
    }
}
