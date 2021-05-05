const {Task} = require("./task");

module.exports.TaskComplexMoveTo = class TaskComplexMoveTo extends Task {
    constructor(creep, positions) {
        super(creep && creep.id, TASK_TYPE_COMPLEX_MOVE_TO)

        this.positions = positions
    }

    run() {
        const positions = this.positions;
        if (!positions) {
            Log.error('No positions ' + positions)

            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        let pos
        for (let position of positions) {
            if (creep.room.name === position.roomName) {
                pos = position

                break
            }
        }

        if (!pos) {
            return false
        }

        if (pos.x === undefined || pos.y === undefined || !pos.roomName) {
            Log.error('Found pos is not pos ' + pos)

            return false
        }

        creep.say(this.type)

        let result = creep.moveTo(pos.x, pos.y, {visualizePathStyle: {stroke: '#ffffff'}});
        // if (result !== OK) {
        //     Log.error('MoveTo - result ' + result)
        //
        //     return false
        // }

        if (!creep.pos.isNearTo(pos)) {

            return true
        }

        creep.say('Done!')

        return false
    }
};
