global._ = require('lodash')
global.debug = (something) => {
    console.log(JSON.stringify(something))
}
global.log = debug

global.TASK_TYPE_SPAWN_CREEP = 'spawn_creep'
global.TASK_TYPE_RENEW_CREEP = 'renew_creep'
global.TASK_TYPE_HARVEST = 'harvest'
global.TASK_TYPE_TRANSFER = 'transfer'
global.TASK_TYPE_BUILD = 'build'
global.TASK_TYPE_UPGRADE_CONTROLLER = 'upgrade_controller'
global.TASK_TYPE_REPAIR = 'repair'
global.TASK_TYPE_HEAL = 'heal'
global.TASK_TYPE_PICKUP = 'pickup'
global.TASK_TYPE_WITHDRAW = 'withdraw'
global.TASK_TYPE_MOVE_TO = 'move_to'
global.TASK_TYPE_CLAIM_CONTROLLER = 'claim_controller'
global.TASK_TYPE_TOWER_ATTACK = 'tower_attack'
global.TASK_TYPE_LINK_TRANSFER_ENERGY = 'link_transfer_energy'
