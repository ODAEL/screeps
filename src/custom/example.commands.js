const {TaskSpawnCreep} = require("../tasks/spawn_creep");
const {TaskComplexMoveTo} = require("../tasks/complex_move_to");

global.spawnHealer = (spawnId) => {
    let spawn = Game.getObjectById(spawnId)
    let initialTask = new TaskComplexMoveTo([
        {x: 49, y: 12, roomName: 'E11N22'},
        {x: 29, y: 0, roomName: 'E12N22'},
        {x: 48, y: 12, roomName: 'E12N23'},
    ], {range: 0})
    let taskSpawnCreep = new TaskSpawnCreep({
        role: 'healer',
        initialTasks: [initialTask],
        automated: true,
        optimalBodyparts: [
            ..._.times(5, () => TOUGH),
            ..._.times(3, () => MOVE),
            ..._.times(5, () => HEAL),
        ]
    })
    spawn.tasks.push(taskSpawnCreep)
}
