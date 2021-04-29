const {LinkTaskProcessor} = require("./link");
const {TowerTaskProcessor} = require("./tower");
const {CreepTaskProcessor} = require("./creep");
const {SpawnTaskProcessor} = require("./spawn");
module.exports.TaskProcessor = {
    process: function () {
        for (let name in Game.spawns) {
            const spawn = Game.spawns[name];
            (new SpawnTaskProcessor(spawn)).process()
        }
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.spawning) {
                continue
            }
            (new CreepTaskProcessor(creep)).process()
        }
        for (let name in Game.structures) {
            const structure = Game.structures[name];
            if (!(structure instanceof StructureTower)) {
                continue
            }

            (new TowerTaskProcessor(structure)).process()
        }
        for (let name in Game.structures) {
            const structure = Game.structures[name];
            if (!(structure instanceof StructureLink)) {
                continue
            }

            (new LinkTaskProcessor(structure)).process()
        }
    },
};
