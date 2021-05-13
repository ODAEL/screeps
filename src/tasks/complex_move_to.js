const {Task} = require("./task");

module.exports.TaskComplexMoveTo = class TaskComplexMoveTo extends Task {
    constructor(positions, data) {
        super(TASK_TYPE_COMPLEX_MOVE_TO)

        this.positions = positions
        this.data = data || {}
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        const positions = this.positions;
        if (!positions) {
            Log.error('No positions ' + positions)

            return false
        }

        let pos
        let last = false
        for (let i = 0; i < positions.length; i++) {
            let position = positions[i]
            if (i === positions.length - 1) {
                last = true
            }
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

        let range = this.data.range || 0

        if (last && (
            (range === 0 && creep.pos.x === pos.x && creep.pos.y === pos.y) || creep.pos.inRangeTo(pos.x, pos.y, range)
        )) {
            creep.say('Done!')

            return false
        }

        return true
    }
};
