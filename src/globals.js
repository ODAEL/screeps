global._ = require('lodash')
global.cl = (something) => {
    console.log(JSON.stringify(something))
}

global.Log = require('./log')

// Just continue current task
global.TASK_CODE_CONTINUE = 1
// Current task data is not valid or irrelevant, need to process new task
global.TASK_CODE_SKIP = 2
// Current task is finished, but new task should dbe started at the next tick
global.TASK_CODE_FINISH = 3

global.BLUEPRINT_TYPE_RAW = 'raw'

global.TASK_TYPE_SPAWN_CREEP = 'SC'
global.TASK_TYPE_RENEW_CREEP = 'RC'
global.TASK_TYPE_HARVEST = 'H'
global.TASK_TYPE_TRANSFER = 'T'
global.TASK_TYPE_BUILD = 'B'
global.TASK_TYPE_UPGRADE_CONTROLLER = 'UC'
global.TASK_TYPE_REPAIR = 'R'
global.TASK_TYPE_HEAL = 'He'
global.TASK_TYPE_PICKUP = 'P'
global.TASK_TYPE_WITHDRAW = 'W'
global.TASK_TYPE_MOVE_TO = 'MT'
global.TASK_TYPE_COMPLEX_MOVE_TO = 'CMT'
global.TASK_TYPE_ATTACK = 'A'
global.TASK_TYPE_RANGED_ATTACK = 'RA'
global.TASK_TYPE_MOVE = 'M'
global.TASK_TYPE_CLAIM_CONTROLLER = 'CC'
global.TASK_TYPE_ATTACK_CONTROLLER = 'AC'
global.TASK_TYPE_REQUEST_RECYCLE = 'RR'
global.TASK_TYPE_DISMANTLE = 'D'
global.TASK_TYPE_TOWER_ATTACK = 'TA'
global.TASK_TYPE_LINK_TRANSFER_ENERGY = 'LTE'

global.TASK_TYPES = [
    TASK_TYPE_SPAWN_CREEP,
    TASK_TYPE_RENEW_CREEP,
    TASK_TYPE_HARVEST,
    TASK_TYPE_TRANSFER,
    TASK_TYPE_BUILD,
    TASK_TYPE_UPGRADE_CONTROLLER,
    TASK_TYPE_REPAIR,
    TASK_TYPE_HEAL,
    TASK_TYPE_PICKUP,
    TASK_TYPE_WITHDRAW,
    TASK_TYPE_MOVE_TO,
    TASK_TYPE_COMPLEX_MOVE_TO,
    TASK_TYPE_ATTACK,
    TASK_TYPE_RANGED_ATTACK,
    TASK_TYPE_MOVE,
    TASK_TYPE_CLAIM_CONTROLLER,
    TASK_TYPE_ATTACK_CONTROLLER,
    TASK_TYPE_REQUEST_RECYCLE,
    TASK_TYPE_DISMANTLE,
    TASK_TYPE_TOWER_ATTACK,
    TASK_TYPE_LINK_TRANSFER_ENERGY,
]
