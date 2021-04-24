const pushTask = (task) => {
    Memory.tasks.push(task)
};

const destroyTask = (task) => {
    for (let i = 0; i < Memory.tasks.length; i++) {
        if (Memory.tasks[i].id === task.id) {
            Memory.tasks.splice(i, 1);
            return
        }
    }
};

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

const runSpawn = (spawn) => {
    const task = currentSpawnTask(spawn);
    if (!task) {
        return false
    }

    if (!task.run()) {
        destroyTask(task)

        return false
    }

    return true
};

const runCreep = (creep) => {
    const task = currentCreepTask(creep);
    if (!task) {
        return false
    }

    if (!task.run()) {
        destroyTask(task)

        return false
    }

    return true
};

const runTower = (tower) => {
    const task = currentTowerTask(tower);
    if (!task) {
        return false
    }

    if (!task.run()) {
        destroyTask(task)

        return false
    }

    return true
};

const taskById = (id) => {
    for (let task of Memory.tasks) {
        if (task.id === id) {
            return getTaskObject(task)
        }
    }
};

const currentTask = (subjectId) => {
    for (let task of Memory.tasks) {
        if (task.subjectId === subjectId) {
            return getTaskObject(task)
        }
    }
};

var currentSpawnTask = (spawnParam) => {
    const spawn = helpers.spawnByParam(spawnParam, true);

    return currentTask(spawn && spawn.id)
}

var currentCreepTask = (creepParam) => {
    const creep = helpers.creepByParam(creepParam, true);

    return currentTask(creep && creep.id)
}

var currentTowerTask = (towerParam) => {
    const tower = helpers.structureByParam(towerParam, true);
    if (!(tower instanceof StructureTower)) {
        log('Found structure is not a tower ' + tower)
    }
    
    return currentTask(tower && tower.id)
}

const spawnCreep = (spawnParam) => {
    const spawn = helpers.spawnByParam(spawnParam, true);

    pushTask(new TaskSpawnCreep(spawn))
};

const renewCreep = (spawnParam, creepParam) => {
    const spawn = helpers.spawnByParam(spawnParam, true);
    const creep = helpers.creepByParam(creepParam, true);

    pushTask(new TaskRenewCreep(spawn, creep))
};

const harvest = (creepParam, sourceParam) => {
    const creep = helpers.creepByParam(creepParam, true);
    const source = helpers.sourceByParam(sourceParam, true);

    pushTask(new TaskHarvest(creep, source))
};

const transfer = (creepParam, targetParam) => {
    const creep = helpers.creepByParam(creepParam, true);
    const target = helpers.objectByParam(targetParam, true);

    pushTask(new TaskTransfer(creep, target))
};

const build = (creepParam, constructionSiteParam) => {
    const creep = helpers.creepByParam(creepParam, true);
    const constructionSite = helpers.constructionSiteByParam(constructionSiteParam, true);

    pushTask(new TaskBuild(creep, constructionSite))
};

const upgradeController = (creepParam, controllerParam) => {
    const creep = helpers.creepByParam(creepParam, true);
    const controller = helpers.controllerByParam(controllerParam, true);

    pushTask(new TaskUpgradeController(creep, controller))
};

const repair = (subjectParam, structureParam) => {
    const subject = helpers.objectByParam(subjectParam, true);
    const structure = helpers.structureByParam(structureParam, true);

    pushTask(new TaskRepair(subject, structure))
};

const towerAttack = (towerParam, targetParam) => {
    const tower = helpers.structureByParam(towerParam, true);
    const target = helpers.objectByParam(targetParam, true);

    pushTask(new TaskTowerAttack(tower, target))
};

module.exports = {
    runSpawn: runSpawn,
    runCreep: runCreep,
    runTower: runTower,
    taskById: taskById,
    currentSpawnTask: currentSpawnTask,
    currentCreepTask: currentCreepTask,
    currentTowerTask: currentTowerTask,
    spawnCreep: spawnCreep,
    renewCreep: renewCreep,
    harvest: harvest,
    transfer: transfer,
    build: build,
    upgradeController: upgradeController,
    repair: repair,
    towerAttack: towerAttack,
};