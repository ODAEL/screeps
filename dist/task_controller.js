const {MemoryManager} = require("./memory_manager");
const {Helpers} = require("./helpers");

const getTaskObject = (task) => {
    const taskClass =
        (task.type === TASK_TYPE_SPAWN_CREEP && TaskSpawnCreep) ||
        (task.type === TASK_TYPE_RENEW_CREEP && TaskRenewCreep) ||
        (task.type === TASK_TYPE_HARVEST && TaskHarvest) ||
        (task.type === TASK_TYPE_TRANSFER && TaskTransfer) ||
        (task.type === TASK_TYPE_BUILD && TaskBuild) ||
        (task.type === TASK_TYPE_UPGRADE_CONTROLLER && TaskUpgradeController) ||
        (task.type === TASK_TYPE_REPAIR && TaskRepair) ||
        (task.type === TASK_TYPE_TOWER_ATTACK && TaskTowerAttack) ||
        (Task);

    return taskClass.deserialize(task)
};

const runTask = (task) => {
    if (!task) {
        return false
    }

    if (!task.run()) {
        MemoryManager.destroyTask(task)

        return false
    }

    return true
}

const currentTask = (subjectParam) => {
    const subject = Helpers.objectByParam(subjectParam)

    for (let task of Memory.tasks) {
        if (task.subjectId === subject.id) {
            return getTaskObject(task)
        }
    }
};

const spawnCreep = (spawnParam) => {
    const spawn = Helpers.spawnByParam(spawnParam, true);

    MemoryManager.pushTask(new TaskSpawnCreep(spawn))
};

const renewCreep = (spawnParam, creepParam) => {
    const spawn = Helpers.spawnByParam(spawnParam, true);
    const creep = Helpers.creepByParam(creepParam, true);

    MemoryManager.pushTask(new TaskRenewCreep(spawn, creep))
};

const harvest = (creepParam, sourceParam) => {
    const creep = Helpers.creepByParam(creepParam, true);
    const source = Helpers.sourceByParam(sourceParam, true);

    MemoryManager.pushTask(new TaskHarvest(creep, source))
};

const transfer = (creepParam, targetParam) => {
    const creep = Helpers.creepByParam(creepParam, true);
    const target = Helpers.objectByParam(targetParam, true);

    MemoryManager.pushTask(new TaskTransfer(creep, target))
};

const build = (creepParam, constructionSiteParam) => {
    const creep = Helpers.creepByParam(creepParam, true);
    const constructionSite = Helpers.constructionSiteByParam(constructionSiteParam, true);

    MemoryManager.pushTask(new TaskBuild(creep, constructionSite))
};

const upgradeController = (creepParam, controllerParam) => {
    const creep = Helpers.creepByParam(creepParam, true);
    const controller = Helpers.controllerByParam(controllerParam, true);

    MemoryManager.pushTask(new TaskUpgradeController(creep, controller))
};

const repair = (subjectParam, structureParam) => {
    const subject = Helpers.objectByParam(subjectParam, true);
    const structure = Helpers.structureByParam(structureParam, true);

    MemoryManager.pushTask(new TaskRepair(subject, structure))
};

const towerAttack = (towerParam, targetParam) => {
    const tower = Helpers.structureByParam(towerParam, true);
    const target = Helpers.objectByParam(targetParam, true);

    MemoryManager.pushTask(new TaskTowerAttack(tower, target))
};

module.exports.TaskController = {
    runTask: runTask,
    currentTask: currentTask,

    spawnCreep: spawnCreep,
    renewCreep: renewCreep,
    harvest: harvest,
    transfer: transfer,
    build: build,
    upgradeController: upgradeController,
    repair: repair,
    towerAttack: towerAttack,
};