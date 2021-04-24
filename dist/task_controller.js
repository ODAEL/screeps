var pushTask = (task) => {
    Memory.tasks.push(task)
}

var destroyTask = (task) => {
    for (var i = 0; i < Memory.tasks.length; i++) {
        if (Memory.tasks[i].id == task.id) {
            Memory.tasks.splice(i, 1);
            return
        }
    }
}

var getTaskObject = (task) => {
    var taskClass =
        (task.type == TASK_TYPE_SPAWN_CREEP && TaskSpawnCreep) ||
        (task.type == TASK_TYPE_RENEW_CREEP && TaskRenewCreep) ||
        (task.type == TASK_TYPE_HARVEST && TaskHarvest) ||
        (task.type == TASK_TYPE_TRANSFER && TaskTransfer) ||
        (task.type == TASK_TYPE_BUILD && TaskBuild) ||
        (task.type == TASK_TYPE_UPGRADE_CONTROLLER && TaskUpgradeController) ||
        (task.type == TASK_TYPE_REPAIR && TaskRepair) ||
        (task.type == TASK_TYPE_TOWER_ATTACK && TaskTowerAttack) ||
        (Task)
    
    return taskClass.deserialize(task)
}

var runSpawn = (spawn) => {
    var task = currentSpawnTask(spawn)
    if (!task) {
        return false
    }
    
    if (!task.run()) {
        destroyTask(task)
        
        return false
    }
    
    return true
}

var runCreep = (creep) => {
    var task = currentCreepTask(creep)
    if (!task) {
        return false
    }
    
    if (!task.run()) {
        destroyTask(task)
        
        return false
    }
    
    return true
}

var runTower = (tower) => {
    var task = currentTowerTask(tower)
    if (!task) {
        return false
    }
    
    if (!task.run()) {
        destroyTask(task)
        
        return false
    }
    
    return true
}

var taskById = (id) => {
    for (var task of Memory.tasks) {
        if (task.id == id) {
            return getTaskObject(task)
        }
    }
}

var currentTask = (subjectId) => {
    for (var task of Memory.tasks) {
        if (task.subjectId == subjectId) {
            return getTaskObject(task)
        }
    }
}

var currentSpawnTask = (spawnParam) => {
    var spawn = helpers.spawnByParam(spawnParam, true)
    
    return currentTask(spawn && spawn.id)
}

var currentCreepTask = (creepParam) => {
    var creep = helpers.creepByParam(creepParam, true)
    
    return currentTask(creep && creep.id)
}

var currentTowerTask = (towerParam) => {
    var tower = helpers.structureByParam(towerParam, true)
    if (!(tower instanceof StructureTower)) {
        log('Found structure is not a tower ' + tower)
    }
    
    return currentTask(tower && tower.id)
}

var spawnCreep = (spawnParam) => {
    var spawn = helpers.spawnByParam(spawnParam, true)
    
    pushTask(new TaskSpawnCreep(spawn))
}

var renewCreep = (spawnParam, creepParam) => {
    var spawn = helpers.spawnByParam(spawnParam, true)
    var creep = helpers.creepByParam(creepParam, true)
    
    pushTask(new TaskRenewCreep(spawn, creep))
}

var harvest = (creepParam, sourceParam) => {
    var creep = helpers.creepByParam(creepParam, true)
    var source = helpers.sourceByParam(sourceParam, true)
    
    pushTask(new TaskHarvest(creep, source))
}

var transfer = (creepParam, targetParam) => {
    var creep = helpers.creepByParam(creepParam, true)
    var target = helpers.objectByParam(targetParam, true)
    
    pushTask(new TaskTransfer(creep, target))
}

var build = (creepParam, constructionSiteParam) => {
    var creep = helpers.creepByParam(creepParam, true)
    var constructionSite = helpers.constructionSiteByParam(constructionSiteParam, true)
    
    pushTask(new TaskBuild(creep, constructionSite))
}

var upgradeController = (creepParam, controllerParam) => {
    var creep = helpers.creepByParam(creepParam, true)
    var controller = helpers.controllerByParam(controllerParam, true)
    
    pushTask(new TaskUpgradeController(creep, controller))
}

var repair = (subjectParam, structureParam) => {
    var subject = helpers.objectByParam(subjectParam, true)
    var structure = helpers.structureByParam(structureParam, true)
    
    pushTask(new TaskRepair(subject, structure))
}

var towerAttack = (towerParam, targetParam) => {
    var tower = helpers.structureByParam(towerParam, true)
    var target = helpers.objectByParam(targetParam, true)
    
    pushTask(new TaskTowerAttack(tower, target))
}

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