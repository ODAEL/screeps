const {Task} = require("./task");

module.exports.TaskMoveTo = class TaskMoveTo extends Task {
    constructor(creep, pos) {
        super(creep && creep.id, TASK_TYPE_MOVE_TO)

        this.pos = (pos instanceof RoomPosition && pos) ||
            (pos instanceof RoomObject && pos.pos) ||
            pos
    }

    run() {
        const pos = this.pos;
        if (!pos) {
            Log.error('No pos ' + pos)

            return false
        }

        if (pos.x === undefined || pos.y === undefined || !pos.roomName) {
            Log.error('Found pos is not pos ' + pos)

            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.room.name !== pos.roomName) {
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
