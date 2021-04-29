const {Deserializer} = require("../tasks/deserializer");

const TYPES_WITH_MEMORY = [
    StructureSpawn,
    Creep,
    StructureTower,
    StructureLink,
];

for (let type of TYPES_WITH_MEMORY) {
    if ('memory' in type.prototype) {
        continue;
    }
    let customMemoryKey = ((type === StructureTower) && 'towers') ||
        ((type === StructureLink) && 'links') ||
        null
    if (!customMemoryKey) {
        continue;
    }

    Object.defineProperty(type.prototype, 'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory[customMemoryKey])) {
                Memory[customMemoryKey] = {};
            }
            if(!_.isObject(Memory[customMemoryKey])) {
                return undefined;
            }
            return Memory[customMemoryKey][this.id] =
                Memory[customMemoryKey][this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory[customMemoryKey])) {
                Memory[customMemoryKey] = {};
            }
            if(!_.isObject(Memory[customMemoryKey])) {
                throw new Error('Could not set object memory. ' + customMemoryKey);
            }
            Memory[customMemoryKey][this.id] = value;
        },
    });
}

for (let type of TYPES_WITH_MEMORY) {
    Object.defineProperty(type.prototype, 'tasks', {
        configurable: true,
        get: function() {
            if(_.isUndefined(this.memory.tasks)) {
                this.memory.tasks = [];
            }
            if(!_.isArray(this.memory.tasks)) {
                return undefined;
            }
            return this.memory.tasks || [];
        },
        set: function(value) {
            if(_.isUndefined(this.memory.tasks)) {
                this.memory.tasks = [];
            }
            if(!_.isArray(this.memory.tasks)) {
                throw new Error('Could not set tasks');
            }
            this.memory.tasks = value;
        },
    });
}

for (let type of TYPES_WITH_MEMORY) {
    Object.defineProperty(type.prototype, 'currentTask', {
        configurable: false,
        get: function() {
            const task = this.tasks[0] || null;
            if (!task) {
                return null
            }
            return Deserializer.deserialize(task)
        },
    });
}

for (let type of TYPES_WITH_MEMORY) {
    type.prototype.endCurrentTask = function () {
        if (this.tasks.length === 0) {
            return
        }

        this.tasks.splice(0, 1);
    };
}

for (let type of TYPES_WITH_MEMORY) {
    type.prototype.blueprintsOrderPosition = function (key, max) {
        this.memory.blueprintsOrderPosition = this.memory.blueprintsOrderPosition || {}

        let position = this.memory.blueprintsOrderPosition[key] || 0
        position =  (position < max) ? position : 0

        this.memory.blueprintsOrderPosition[key] = position + 1
        return position
    };
}
