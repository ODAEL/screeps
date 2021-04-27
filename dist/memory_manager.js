module.exports.MemoryManager = {
    init: () => {
        Memory.tasks = Memory.tasks || []

        Memory.towers = Memory.towers || {}
        Memory.links = Memory.links || {}
    },
    cleanUp: () => {
        let tasksCleared = 0;
        for (let i = 0; i < Memory.tasks.length; i++) {
            if (!Game.getObjectById(Memory.tasks[i].subjectId)) {
                tasksCleared++
                Memory.tasks.splice(i--, 1);
            }
        }
        
        log(tasksCleared + ' tasks was cleared')


        let creepsCleared = 0;
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                creepsCleared++
                delete Memory.creeps[name];
            }
        }

        log(creepsCleared + ' creeps was cleared')


        let towersCleared = 0;
        for (let id in Memory.towers) {
            if (!Game.getObjectById(id)) {
                towersCleared++
                delete Memory.towers[id];
            }
        }

        log(towersCleared + ' towers was cleared')


        let linksCleared = 0;
        for (let id in Memory.links) {
            if (!Game.getObjectById(id)) {
                linksCleared++
                delete Memory.links[id];
            }
        }

        log(linksCleared + ' links was cleared')
    },


    creeps: () => {
        return Memory.creeps
    },
    creepMemory: (creep) => {
        return Memory.creeps[creep.name]
    },


    towers: () => {
        return Memory.towers
    },
    towerMemory: (tower) => {
        return Memory.towers[tower.id] || {}
    },
    setTowerMemory: (tower, memory) => {
        Memory.towers[tower.id] = Memory.towers[tower.id] || {}
        Memory.towers[tower.id] = memory
    },


    links: () => {
        return Memory.links
    },
    linkMemory: (link) => {
        return Memory.links[link.id] || {}
    },
    setLinkMemory: (link, memory) => {
        Memory.links[link.id] = Memory.links[link.id] || {}
        Memory.links[link.id] = memory
    },


    tasks: () => {
        return Memory.tasks
    },
    pushTask: (task) => {
        Memory.tasks.push(task)
    },
    destroyTask: (task) => {
        for (let i = 0; i < Memory.tasks.length; i++) {
            if (Memory.tasks[i].id === task.id) {
                Memory.tasks.splice(i, 1);
                return
            }
        }
    },


    blueprintsOrderPosition: (key, max) => {
        Memory.blueprintsOrderPosition = Memory.blueprintsOrderPosition || {}
        Memory.blueprintsOrderPosition[key] = Memory.blueprintsOrderPosition[key] || 0
        Memory.blueprintsOrderPosition[key] =  (Memory.blueprintsOrderPosition[key]) < max ? Memory.blueprintsOrderPosition[key] : 0
        return Memory.blueprintsOrderPosition[key]++
    }
};
