const {Helpers} = require("./helpers");
const {RoomWrapper} = require("./wrappers");

class Task {
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

    static getTaskObject(task) {
        const taskClass =
            (task.type === TASK_TYPE_SPAWN_CREEP && TaskSpawnCreep) ||
            (task.type === TASK_TYPE_RENEW_CREEP && TaskRenewCreep) ||
            (task.type === TASK_TYPE_HARVEST && TaskHarvest) ||
            (task.type === TASK_TYPE_TRANSFER && TaskTransfer) ||
            (task.type === TASK_TYPE_BUILD && TaskBuild) ||
            (task.type === TASK_TYPE_UPGRADE_CONTROLLER && TaskUpgradeController) ||
            (task.type === TASK_TYPE_REPAIR && TaskRepair) ||
            (task.type === TASK_TYPE_HEAL && TaskHeal) ||
            (task.type === TASK_TYPE_TOWER_ATTACK && TaskTowerAttack) ||
            (Task);

        return taskClass.deserialize(task)
    };
}

class TaskSpawnCreep extends Task {
    constructor(spawn, data) {
        super(TASK_SUBJECT_TYPE_SPAWN, spawn && spawn.id, TASK_TYPE_SPAWN_CREEP)

        this.data = data || {}
    }

    run() {
        const spawn = Game.getObjectById(this.subjectId);
        const roomWrapper = new RoomWrapper(Game.getObjectById(this.subjectId).room);

        let memory = {
            role: this.data.role || 'default'
        }

        let optimalBodyparts = this.data.optimalBodyparts || [WORK, CARRY, MOVE];

        if (spawn.spawnCreep(Helpers.chooseBodyparts(roomWrapper.energyCapacityAvailable(), optimalBodyparts), 'Creep ' + Game.time, {memory: memory}) === OK) {
            return false
        }

        return true
    }

    static deserialize(task) {
        return super.deserialize(task, TaskSpawnCreep)
    }
}

class TaskRenewCreep extends Task {
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

class TaskHarvest extends Task {
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

class TaskTransfer extends Task {
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

class TaskBuild extends Task {
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

class TaskUpgradeController extends Task {
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

class TaskRepair extends Task {
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
            log(2)
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

class TaskHeal extends Task {
    constructor(subject, creep) {
        super(TaskHeal.getSubjectType(subject), subject && subject.id, TASK_TYPE_HEAL)

        this.creepId = creep && creep.id
    }

    static getSubjectType(subject) {
        return !subject ? null : (
            (subject instanceof Creep && TASK_SUBJECT_TYPE_CREEP) ||
            (subject instanceof StructureTower && TASK_SUBJECT_TYPE_TOWER) ||
            null
        )
    }

    run() {
        const creep = Game.getObjectById(this.creepId);
        if (!creep) {
            debug('Unable to find creep by id=' + this.creepId)

            return false
        }

        if (!(creep instanceof Creep)) {
            debug('Found object is not creep ' + creep)

            return false
        }

        if (creep.hitsMax === creep.hits) {
            debug('Creep has maximum hits ' + creep)

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

        if (subject.heal(creep) === ERR_NOT_IN_RANGE) {
            if (subject instanceof Creep) {
                subject.moveTo(creep, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                return false
            }

            return true
        }

        if (creep.hitsMax === creep.hits) {
            return false
        }

        // TODO Uncomment and do something with tower long healing
        // if (subject.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        //     return true
        // }

        subject instanceof Creep && subject.say('Done!')

        return false
    }

    static deserialize(task) {
        return super.deserialize(task, TaskHeal)
    }
}

class TaskTowerAttack extends Task {
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

module.exports.Task = Task;
module.exports.TaskSpawnCreep = TaskSpawnCreep;
module.exports.TaskRenewCreep = TaskRenewCreep;
module.exports.TaskHarvest = TaskHarvest;
module.exports.TaskTransfer = TaskTransfer;
module.exports.TaskBuild = TaskBuild;
module.exports.TaskUpgradeController = TaskUpgradeController;
module.exports.TaskRepair = TaskRepair;
module.exports.TaskHeal = TaskHeal;
module.exports.TaskTowerAttack = TaskTowerAttack;
