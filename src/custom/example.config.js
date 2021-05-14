const {BLUEPRINT_CHOOSE_LOGIC_PRIORITY} = require("../blueprints/container");
const {BLUEPRINT_CHOOSE_LOGIC_ORDER} = require("../blueprints/container");
const {__} = require("../filters");
const {Filters} = require("../filters");
const {BlueprintBuilder} = require("../blueprints/blueprint");
const {BlueprintContainer} = require("../blueprints/container");

const F = Filters
const BB = BlueprintBuilder
const BC = BlueprintContainer
const t = (number, value) => _.times(number, () => value)

const roomsConfig = {
    'E11N22': {
        creepsRoleData: {
            'default': {
                count: 2,
                optimalBodyparts: [
                    ...t(6, WORK),
                    ...t(6, CARRY),
                    ...t(4, MOVE),
                ],
                blueprints: new BC(
                    new BC(
                        F.usedCapacity(__.eq(0)),
                        BLUEPRINT_CHOOSE_LOGIC_ORDER,
                        BB.harvest([F.instanceof(Source)]),
                        BB.withdraw([F.instanceof(Tombstone)]),
                        BB.withdraw([F.instanceof(Ruin)]),
                        BB.pickup(),
                    ),
                    new BC(
                        F.usedCapacity(__.gt(0), RESOURCE_ENERGY),
                        BLUEPRINT_CHOOSE_LOGIC_PRIORITY,
                        new BC(
                            BLUEPRINT_CHOOSE_LOGIC_ORDER,
                            ...t(4, BB.transfer([F.structureType(__.in([STRUCTURE_SPAWN, STRUCTURE_EXTENSION])), F.my()])),
                            ...t(1, BB.transfer([F.structureType(__.eq(STRUCTURE_TOWER)), F.my(), F.energy(__.lt(900))])),
                            ...t(1, BB.transfer([F.structureType(__.eq(STRUCTURE_CONTAINER))])),
                        ),
                        BB.build(),
                        BB.transfer([F.id('some_id'), F.usedCapacity(__.lt(10000), RESOURCE_ENERGY)]),
                        BB.upgradeController(),
                    ),
                ),
            },
            'upgrader': {
                count: 1,
                optimalBodyparts: [
                    ...t(10, WORK),
                    ...t(2, CARRY),
                    ...t(2, MOVE),
                ],
                blueprints: new BC(
                    new BC(
                        F.usedCapacity(__.eq(0)),
                        BB.withdraw([F.instanceof(StructureLink), F.usedCapacity(__.gt(0), RESOURCE_ENERGY)]),
                    ),
                    new BC(
                        F.usedCapacity(__.gt(0), RESOURCE_ENERGY),
                        BB.upgradeController(),
                    ),
                ),
            },
        },
        linksRoleData: {
            'right': {
                blueprints: new BC(
                    F.usedCapacity(__.gt(0), RESOURCE_ENERGY),
                    BB.linkTransferEnergy([F.id('some_id')])
                ),
            },
        },
    },
};

const defaultCreepRoleData = {
    count: 1,
    automated: true,
    initialTasks: [],
    optimalBodyparts: [
        ...t(6, WORK),
        ...t(6, CARRY),
        ...t(6, MOVE),
    ],
    blueprints: new BC(
        new BC(
            F.usedCapacity(__.eq(0)),
            BLUEPRINT_CHOOSE_LOGIC_ORDER,
            BB.harvest([F.instanceof(Source)]),
            BB.withdraw([F.instanceof(Tombstone)]),
            BB.pickup(),
        ),
        new BC(
            F.usedCapacity(__.gt(0), RESOURCE_ENERGY),
            BLUEPRINT_CHOOSE_LOGIC_ORDER,
            ...t(8, BB.transfer([F.structureType(__.in([STRUCTURE_SPAWN, STRUCTURE_EXTENSION])), F.my()])),
            ...t(1, BB.transfer([F.structureType(__.eq(STRUCTURE_TOWER)), F.my(), F.energy(__.lt(900))])),
            ...t(1, BB.transfer([F.structureType(__.eq(STRUCTURE_CONTAINER))])),
            ...t(1, BB.upgradeController()),
            ...t(4, BB.build()),
        ),
    ),
};

const defaultTowerRoleData = {
    blueprints: new BC(
        F.usedCapacity(__.gt(0), RESOURCE_ENERGY),
        BLUEPRINT_CHOOSE_LOGIC_ORDER,
        ...t(2, BB.repair([F.structureType(__.eq(STRUCTURE_ROAD)), F.hitsPercentage(__.lt(0.50))])),
        ...t(1, BB.repair([F.structureType(__.eq(STRUCTURE_CONTAINER)), F.hitsPercentage(__.lt(0.2))])),
        ...t(1, BB.repair([F.structureType(__.eq(STRUCTURE_RAMPART)), F.hits(__.lt(30000))])),
        ...t(1, BB.repair([F.structureType(__.eq(STRUCTURE_WALL)), F.hits(__.lt(30000))])),
        ...t(4, BB.towerAttack()),
        ...t(2, BB.heal()),
    ),
};

const defaultLinkRoleData = {
    blueprints: new BC(),
};

module.exports.Config = {
    roomsConfig: roomsConfig,
    defaultCreepRoleData: defaultCreepRoleData,
    defaultTowerRoleData: defaultTowerRoleData,
    defaultLinkRoleData: defaultLinkRoleData,
}
