const {TaskDismantle} = require("./dismantle");
const {TaskRequestRecycle} = require("./request_recycle");
const {TaskMove} = require("./move");
const {TaskRangedAttack} = require("./ranged_attack");
const {TaskAttack} = require("./attack");
const {TaskComplexMoveTo} = require("./complex_move_to");
const {Task} = require("./task");
const {TaskLinkTransferEnergy} = require("./link_transfer_energy");
const {TaskTowerAttack} = require("./tower_attack");
const {TaskClaimController} = require("./claim_controller");
const {TaskMoveTo} = require("./move_to");
const {TaskWithdraw} = require("./withdraw");
const {TaskPickup} = require("./pickup");
const {TaskHeal} = require("./heal");
const {TaskRepair} = require("./repair");
const {TaskUpgradeController} = require("./upgrade_controller");
const {TaskBuild} = require("./build");
const {TaskTransfer} = require("./transfer");
const {TaskHarvest} = require("./harvest");
const {TaskRenewCreep} = require("./renew_creep");
const {TaskSpawnCreep} = require("./spawn_creep");

module.exports.Deserializer = {
    deserialize: (taskData) => {
        const taskClass =
            (taskData.type === TASK_TYPE_SPAWN_CREEP && TaskSpawnCreep) ||
            (taskData.type === TASK_TYPE_RENEW_CREEP && TaskRenewCreep) ||
            (taskData.type === TASK_TYPE_HARVEST && TaskHarvest) ||
            (taskData.type === TASK_TYPE_TRANSFER && TaskTransfer) ||
            (taskData.type === TASK_TYPE_BUILD && TaskBuild) ||
            (taskData.type === TASK_TYPE_UPGRADE_CONTROLLER && TaskUpgradeController) ||
            (taskData.type === TASK_TYPE_REPAIR && TaskRepair) ||
            (taskData.type === TASK_TYPE_HEAL && TaskHeal) ||
            (taskData.type === TASK_TYPE_PICKUP && TaskPickup) ||
            (taskData.type === TASK_TYPE_WITHDRAW && TaskWithdraw) ||
            (taskData.type === TASK_TYPE_MOVE_TO && TaskMoveTo) ||
            (taskData.type === TASK_TYPE_COMPLEX_MOVE_TO && TaskComplexMoveTo) ||
            (taskData.type === TASK_TYPE_ATTACK && TaskAttack) ||
            (taskData.type === TASK_TYPE_RANGED_ATTACK && TaskRangedAttack) ||
            (taskData.type === TASK_TYPE_MOVE && TaskMove) ||
            (taskData.type === TASK_TYPE_CLAIM_CONTROLLER && TaskClaimController) ||
            (taskData.type === TASK_TYPE_REQUEST_RECYCLE && TaskRequestRecycle) ||
            (taskData.type === TASK_TYPE_DISMANTLE && TaskDismantle) ||
            (taskData.type === TASK_TYPE_TOWER_ATTACK && TaskTowerAttack) ||
            (taskData.type === TASK_TYPE_LINK_TRANSFER_ENERGY && TaskLinkTransferEnergy) ||
            (Task);

        const task = new taskClass();
        Object.assign(task, taskData)

        return task
    },
}