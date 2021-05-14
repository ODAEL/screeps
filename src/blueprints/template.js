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

const SIMPLE_NON_ENERGY_RESOURCES = [
    RESOURCE_HYDROGEN,
    RESOURCE_OXYGEN,
    RESOURCE_UTRIUM,
    RESOURCE_LEMERGIUM,
    RESOURCE_KEANIUM,
    RESOURCE_ZYNTHIUM,
    RESOURCE_CATALYST,
    RESOURCE_GHODIUM,

    RESOURCE_HYDROXIDE,
    RESOURCE_ZYNTHIUM_KEANITE,
    RESOURCE_UTRIUM_LEMERGITE,

    RESOURCE_UTRIUM_HYDRIDE,
    RESOURCE_UTRIUM_OXIDE,
    RESOURCE_KEANIUM_HYDRIDE,
    RESOURCE_KEANIUM_OXIDE,
    RESOURCE_LEMERGIUM_HYDRIDE,
    RESOURCE_LEMERGIUM_OXIDE,
    RESOURCE_ZYNTHIUM_HYDRIDE,
    RESOURCE_ZYNTHIUM_OXIDE,
    RESOURCE_GHODIUM_HYDRIDE,
    RESOURCE_GHODIUM_OXIDE,
];

module.exports.BlueprintTemplates = {
    withdrawMultipleResources: (withdrawObjectFilters, transferStructureFilters, resources = SIMPLE_NON_ENERGY_RESOURCES) => {
        let withdrawBlueprints = []
        for (let resource of resources) {
            withdrawBlueprints.push(
                BB.withdraw([...withdrawObjectFilters, F.usedCapacity(__.gt(0), resource)], {resourceType: resource})
            )
        }

        let bcs = [new BC(
            F.freeCapacity(__.gt(0)),
            BLUEPRINT_CHOOSE_LOGIC_PRIORITY,
            ...withdrawBlueprints,
        )]

        for (let resource of resources) {
            bcs.push(new BC(
                F.usedCapacity(__.gt(0), resource),
                BB.transfer(transferStructureFilters, {resourceType: resource}),
            ));
        }

        return new BC(
            ...bcs,
        );
    },
}
