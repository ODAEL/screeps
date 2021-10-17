const {Task} = require("./task");

module.exports.TaskMoveTo = class TaskMoveTo extends Task {
    constructor(pos, data) {
        super(TASK_TYPE_MOVE_TO)

        this.pos = (pos instanceof RoomPosition && pos) ||
            (pos instanceof RoomObject && pos.pos) ||
            pos

        this.data = data || {}
    }

    run(creep) {
        let range = this.data.range || 1

        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const pos = this.pos;
        if (!pos) {
            Log.error('No pos ' + pos)

            return this.skip()
        }

        if (pos.x === undefined || pos.y === undefined) {
            Log.error('Found pos is not pos ' + pos)

            return this.skip()
        }

        if (!pos.roomName) {
            pos.roomName = creep.room.name
        }

        creep.say(this.type)

        let result = creep.moveTo(pos.x, pos.y, {visualizePathStyle: {stroke: '#ffffff'}});
        // if (result !== OK) {
        //     Log.error('MoveTo - result ' + result)
        //
        //     return this.finish()
        // }

        if (!(range === 0 && creep.pos.x === pos.x && creep.pos.y === pos.y) && !creep.pos.inRangeTo(pos.x, pos.y, range)) {
            return this.continue()
        }

        creep.say('Done!')

        return this.skip()
    }
};
