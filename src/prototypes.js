const customMemory = (memoryKey) => ({
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory[memoryKey])) {
            Memory[memoryKey] = {};
        }
        if(!_.isObject(Memory[memoryKey])) {
            return undefined;
        }
        return Memory[memoryKey][this.id] =
            Memory[memoryKey][this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory[memoryKey])) {
            Memory[memoryKey] = {};
        }
        if(!_.isObject(Memory[memoryKey])) {
            throw new Error('Could not set source memory');
        }
        Memory[memoryKey][this.id] = value;
    }
});

Object.defineProperty(StructureTower.prototype, 'memory', customMemory('towers'));
Object.defineProperty(StructureLink.prototype, 'memory', customMemory('links'));
