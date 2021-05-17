const {Task} = require("./task");

module.exports.TaskMoveTo = class TaskMoveTo extends Task {
    constructor(pos) {
        super(TASK_TYPE_MOVE_TO)

        this.pos = (pos instanceof RoomPosition && pos) ||
            (pos instanceof RoomObject && pos.pos) ||
            pos
    }

    run(creep) {
        if (!creep || !(creep instanceof Creep)) {
            return this.skip()
        }

        const pos = this.pos;
        if (!pos) {
            Log.error('No pos ' + pos)

            return this.skip()
        }

        if (pos.x === undefined || pos.y === undefined || !pos.roomName) {
            Log.error('Found pos is not pos ' + pos)

            return this.skip()
        }

        if (creep.room.name !== pos.roomName) {
            return this.skip()
        }

        creep.say(this.type)

        let result = creep.moveTo(pos.x, pos.y, {visualizePathStyle: {stroke: '#ffffff'}});
        // if (result !== OK) {
        //     Log.error('MoveTo - result ' + result)
        //
        //     return this.finish()
        // }

        if (!creep.pos.isNearTo(pos)) {

            return this.continue()
        }

        creep.say('Done!')

        return this.skip()
    }
};
