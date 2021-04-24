global.debug = (something) => {
    console.log(JSON.stringify(something))
}

global.log = debug

global.tc = require('task_controller')
global.helpers = require('helpers')
global.blueprintsHelper = require('helper.blueprints')

global.Task = require('task')
global.TaskSpawnCreep = require('task.spawn_creep')
global.TaskRenewCreep = require('task.renew_creep')
global.TaskHarvest = require('task.harvest')
global.TaskTransfer = require('task.transfer')
global.TaskBuild = require('task.build')
global.TaskRepair = require('task.repair')
global.TaskUpgradeController = require('task.upgrade_controller')
global.TaskTowerAttack = require('task.tower_attack')

global.SourceWrapper = require('wrapper.source')
global.RoomWrapper = require('wrapper.room')
global.SpawnWrapper = require('wrapper.spawn')
