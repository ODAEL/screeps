const {Config} = require("../../custom/config");
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

        let creepNames = [];

        let needToPush = false
        for (let name in Game.creeps) {
            if (name === Memory.cntc) {
                needToPush = true
            }
            if (needToPush) {
                creepNames.push(name);
            }
        }

        for (let name in Game.creeps) {
            if (name === Memory.cntc) {
                break;
            }
            creepNames.push(name);
        }

        for (let name of creepNames) {
            if (Game.cpu.getUsed() > Config.cpuToPostpone) {
                // Creep name to continue
                Memory.cntc = name
                break;
            }
            const creep = Game.creeps[name];
            if (creep.spawning) {
                continue
            }
            (new CreepTaskProcessor(creep)).process()
        }
    },
};
