let f = (fn) => {
    return fn instanceof Function ? fn : (actual) => _.isEqual(actual, fn) // eq
}

module.exports.__ = {
    and: (...fns) => ((actual) => {
        return _.every(fns, (fn) => fn(actual))
    }),
    or: (...fns) => ((actual) => {
        return _.some(fns, (fn) => fn(actual))
    }),

    eq: (expected) => ((actual) => _.isEqual(actual, expected)),
    neq: (expected) => ((actual) => !_.isEqual(actual, expected)),
    gt: (expected) => ((actual) => _.gt(actual, expected)),
    lt: (expected) => ((actual) => _.lt(actual, expected)),
    in: (expected) => ((actual) => expected.indexOf(actual) !== -1),
}

module.exports.Filters = {
    // Simple filters
    hits: (fn) => ((object) => {
        return f(fn)(object.hits);
    }),
    hitsPercentage: (fn) => ((object) => {
        return f(fn)(object.hits / object.hitsMax);
    }),
    structureType: (fn) => ((object) => {
        return f(fn)(object.structureType);
    }),
    ticksToLive: (fn) => ((object) => {
        return f(fn)(object.ticksToLive);
    }),
    freeCapacity: (fn, resource) => ((object) => {
        let capacity = object.store.getFreeCapacity(resource)
        capacity = (capacity !== null) ? capacity : object.store.getFreeCapacity(RESOURCE_ENERGY)
        return f(fn)(capacity);
    }),
    usedCapacity: (fn, resource) => ((object) => {
        let capacity = object.store.getUsedCapacity(resource)
        capacity = (capacity !== null) ? capacity : object.store.getUsedCapacity(RESOURCE_ENERGY)
        return f(fn)(capacity);
    }),
    energy: (fn) => ((object) => {
        return f(fn)(object.energy);
    }),
    cooldown: (fn) => ((object) => {
        return f(fn)(object.cooldown);
    }),
    posX: (fn) => ((object) => {
        return f(fn)(object.pos.x);
    }),
    posY: (fn) => ((object) => {
        return f(fn)(object.pos.y);
    }),
    pos: (fn) => ((object) => {
        return f(fn)({x: object.pos.x, y: object.pos.y})
    }),
    role: (fn) => ((object) => {
        let memory = object.memory
        if (!memory) {
            return false
        }
        return f(fn)(memory.role || 'default');
    }),


    my: (strict = true) => ((object) => {
        return strict ? object.my : object.my !== false
    }),
    notMy: (strict = true) => ((object) => {
        return strict ? !object.my : object.my === false
    }),
    nearTo: (to) => ((object) => {
        return object.pos.isNearTo(to)
    }),
    id: (id) => ((object) => {
        return object.id === id
    }),
    withStore: () => ((object) => {
        return object.store !== undefined
    }),
    instanceof: (type) => ((object) => {
        return object instanceof type
    }),
};
