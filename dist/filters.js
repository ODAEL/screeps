module.exports.__ = {
    eq: (expected) => ((actual) => _.isEqual(actual, expected)),
    gt: (expected) => ((actual) => _.gt(actual, expected)),
    lt: (expected) => ((actual) => _.lt(actual, expected)),
    in: (expected) => ((actual) => expected.indexOf(actual) !== -1),
}

module.exports.Filters = {
    combineFilters: (filters) => ((object) => {
        for (let filter of filters) {
            if (!filter(object)) {
                return false;
            }
        }

        return true;
    }),

    // Simple filters
    hits: (fn) => ((object) => {
        return fn(object.hits);
    }),
    hitsPercentage: (fn) => ((object) => {
        return fn((object.hits / object.hitsMax));
    }),
    structureType: (fn) => ((object) => {
        return fn(object.structureType);
    }),
    ticksToLive: (fn) => ((object) => {
        return fn(object.ticksToLive);
    }),
    freeCapacityEnergy: (fn) => ((object) => {
        return !object.store || fn(object.store.getFreeCapacity(RESOURCE_ENERGY));
    }),
    usedCapacityEnergy: (fn) => ((object) => {
        return fn(object.store.getUsedCapacity(RESOURCE_ENERGY));
    }),


    my: (strict = true) => ((object) => {
        return strict ? object.my : object.my !== false
    }),
    nearTo: (to) => ((object) => {
        return object.pos.isNearTo(to)
    }),

};
