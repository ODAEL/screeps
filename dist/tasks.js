const {RoomWrapper} = require("./wrappers");

global.TASK_SUBJECT_TYPE_SPAWN = 'spawn'
global.TASK_SUBJECT_TYPE_CREEP = 'creep'
global.TASK_SUBJECT_TYPE_TOWER = 'tower'

global.TASK_TYPE_SPAWN_CREEP = 'spawn_creep'
global.TASK_TYPE_RENEW_CREEP = 'renew_creep'
global.TASK_TYPE_HARVEST = 'harvest'
global.TASK_TYPE_TRANSFER = 'transfer'
global.TASK_TYPE_BUILD = 'build'
global.TASK_TYPE_UPGRADE_CONTROLLER = 'upgrade_controller'
global.TASK_TYPE_REPAIR = 'repair'
global.TASK_TYPE_TOWER_ATTACK = 'tower_attack'

global.Task = class Task {
    constructor(subjectType, subjectId, type) {
        this.id = Game.time + '_' + Math.abs(Math.random() * 2e8 | 0)
        this.subjectType = subjectType
        this.subjectId = subjectId
        this.type = type
    }

    run() {
        debug('Not implemented')

        return false
    }

    static deserialize(task, taskClass = Task) {
        const obj = new taskClass();
        Object.assign(obj, task)

        return obj
    }

    getObjectById(id) {
        const object = Game.getObjectById(id);
        if (!object) {
            log('Unable to find object by id=' + id)
        }

        return object
    }
}

global.TaskSpawnCreep = class TaskSpawnCreep extends Task {
    constructor(spawn) {
        super(TASK_SUBJECT_TYPE_SPAWN, spawn && spawn.id, TASK_TYPE_SPAWN_CREEP)
    }

    run() {
        const spawn = Game.getObjectById(this.subjectId);

        if (spawn.spawnCreep(this.chooseBodyParts(), 'Creep ' + Game.time) === OK) {
            return false
        }

        return true
    }

    static deserialize(task) {
        return super.deserialize(task, TaskSpawnCreep)
    }

    chooseBodyParts() {
        const roomWrapper = new RoomWrapper(Game.getObjectById(this.subjectId).room);
        const energyCapacityAvailable = roomWrapper.energyCapacityAvailable();

        let i = 0;
        const bodyParts = [];
        let totalCost = 0;

        if (roomWrapper.myCreeps().length === 0) {
            return [WORK, CARRY, MOVE]
        }

        while (true) {
            let bodyPart, cost;
            if (i % 3 === 0) {
                bodyPart = MOVE
                cost = 50
            }
            if (i % 3 === 1) {
                bodyPart = WORK
                cost = 100
            }
            if (i % 3 === 2) {
                bodyPart = CARRY
                cost = 50
            }

            if (totalCost + cost > energyCapacityAvailable) {
                break
            }

            bodyParts.push(bodyPart)
            totalCost += cost

            i++
        }

        if (energyCapacityAvailable - totalCost >= 50) {
            bodyParts.push(MOVE)
        }

        return bodyParts
    }
}

global.TaskRenewCreep = class TaskRenewCreep extends Task {
    constructor(spawn, creep) {
        super(TASK_SUBJECT_TYPE_SPAWN, spawn && spawn.id, TASK_TYPE_RENEW_CREEP)

        this.creepId = creep && creep.id
    }

    run() {
        const spawn = Game.getObjectById(this.subjectId);
        if (!spawn) {
            return false
        }

        if (spawn.spawning) {
            return false
        }

        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            return false
        }

        spawn.renewCreep(creep)

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskRenewCreep)
    }
}

global.TaskHarvest = class TaskHarvest extends Task {
    constructor(creep, source) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_HARVEST)

        this.sourceId = source && source.id
    }

    run() {
        const creep = Game.getObjectById(this.subjectId);

        if (!creep) {
            debug('Unable to find creep by id=' + this.subjectId)

            return false
        }

        creep.say(this.type)

        if(creep.store.getFreeCapacity() > 0) {
            const source = Game.getObjectById(this.sourceId);

            const harvestResult = creep.harvest(source);
            if (harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                return true
            }
            if (harvestResult === ERR_NOT_ENOUGH_RESOURCES) {
                return false
            }

            return true
        }

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskHarvest)
    }
}

global.TaskTransfer = class TaskTransfer extends Task {
    constructor(creep, target) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_TRANSFER)

        this.targetId = target && target.id
    }

    run() {
        const target = Game.getObjectById(this.targetId);
        if (!target) {
            debug('Unable to find target by id=' + this.targetId)

            return false
        }

        if (target.store && target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // debug(creep.store.getCapacity(RESOURCE_ENERGY))
            return true
        }

        creep.say('Done!')

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskTransfer)
    }
}

global.TaskBuild = class TaskBuild extends Task {
    constructor(creep, constructionSite) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_BUILD)

        this.constructionSiteId = constructionSite && constructionSite.id
    }

    run() {
        const constructionSite = this.getObjectById(this.constructionSiteId);
        if (!constructionSite) {
            return false
        }

        if (!(constructionSite instanceof ConstructionSite)) {
            debug('Target is not a construction site')

            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        // If have built
        if (!Game.getObjectById(this.constructionSiteId)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return true
        }

        creep.say('Done!')

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskBuild)
    }
}

global.TaskUpgradeController = class TaskUpgradeController extends Task {
    constructor(creep, controller) {
        super(TASK_SUBJECT_TYPE_CREEP, creep && creep.id, TASK_TYPE_UPGRADE_CONTROLLER)

        this.controllerId = controller && controller.id
    }

    run() {
        const controller = Game.getObjectById(this.controllerId);
        if (!controller) {
            debug('Unable to find controller by id=' + this.controllerId)

            return false
        }

        if (!(controller instanceof StructureController)) {
            debug('Found object is not a controller ' + controller)

            return false
        }

        const creep = Game.getObjectById(this.subjectId);
        if (!creep || !(creep instanceof Creep)) {
            return false
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        creep.say(this.type)

        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});

            return true
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // debug(creep.store.getCapacity(RESOURCE_ENERGY))
            return true
        }

        creep.say('Done!')

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskUpgradeController)
    }
}

global.TaskRepair = class TaskRepair extends Task {
    constructor(subject, structure) {
        super(TaskRepair.getSubjectType(subject), subject && subject.id, TASK_TYPE_REPAIR)

        this.structureId = structure && structure.id
    }

    static getSubjectType(subject) {
        return !subject ? null : (
            (subject instanceof Creep && TASK_SUBJECT_TYPE_CREEP) ||
            (subject instanceof StructureTower && TASK_SUBJECT_TYPE_TOWER) ||
            null
        )
    }

    run() {
        const structure = Game.getObjectById(this.structureId);
        if (!structure) {
            debug('Unable to find target by id=' + this.structureId)

            return false
        }

        if (!(structure instanceof Structure)) {
            debug('Found object is not structure ' + structure)

            return false
        }

        if (structure.hitsMax === structure.hits) {
            debug('Structure has maximum hist ' + structure)

            return false
        }

        const subject = Game.getObjectById(this.subjectId);
        if (!subject || !(subject instanceof Creep || subject instanceof StructureTower)) {
            return false
        }

        if (subject.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        subject instanceof Creep && subject.say(this.type)

        if (subject.repair(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            if (subject instanceof Creep) {
                subject.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                return false
            }

            return true
        }

        if (structure.hitsMax === structure.hits) {
            return false
        }

        // TODO Uncomment and do something with tower repairinglong repairing
        // if (subject.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        //     return true
        // }

        subject instanceof Creep && subject.say('Done!')

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskRepair)
    }
}

global.TaskTowerAttack = class TaskTowerAttack extends Task {
    constructor(tower, target) {
        super(TASK_SUBJECT_TYPE_TOWER, tower && tower.id, TASK_TYPE_TOWER_ATTACK)

        this.targetId = target && target.id
    }

    run() {
        const target = Game.getObjectById(this.targetId);
        if (!target) {
            debug('Unable to find target by id=' + this.targetId)

            return false
        }

        if (target.my) {
            debug('Found object is yours ' + target)

            return false
        }

        const tower = Game.getObjectById(this.subjectId);
        if (!tower || !(tower instanceof StructureTower)) {
            return false
        }

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            return false
        }

        tower.attack(target)

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskTowerAttack)
    }
}
