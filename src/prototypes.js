const {Deserializer} = require("./tasks/deserializer");
const customMemoryAttributesCallback = (memoryKey) => ({
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
            throw new Error('Could not set object memory. ' + memoryKey);
        }
        Memory[memoryKey][this.id] = value;
    }
});

Object.defineProperty(StructureTower.prototype, 'memory', customMemoryAttributesCallback('towers'));
Object.defineProperty(StructureLink.prototype, 'memory', customMemoryAttributesCallback('links'));

const tasksAttributes = {
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
};

Object.defineProperty(StructureSpawn.prototype, 'tasks', tasksAttributes);
Object.defineProperty(Creep.prototype, 'tasks', tasksAttributes);
Object.defineProperty(StructureTower.prototype, 'tasks', tasksAttributes);
Object.defineProperty(StructureLink.prototype, 'tasks', tasksAttributes);

const currentTaskAttributes = {
    configurable: false,
    get: function() {
        const task = this.tasks[0] || null;
        if (!task) {
            return null
        }
        return Deserializer.deserialize(task)
    },
}

Object.defineProperty(StructureSpawn.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(Creep.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(StructureTower.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(StructureLink.prototype, 'currentTask', currentTaskAttributes);

const endCurrentTask = function () {
    if (this.tasks.length === 0) {
        return
    }

    this.tasks.splice(0, 1);
}

StructureSpawn.prototype.endCurrentTask = endCurrentTask
Creep.prototype.endCurrentTask = endCurrentTask
StructureTower.prototype.endCurrentTask = endCurrentTask
StructureLink.prototype.endCurrentTask = endCurrentTask

const blueprintsOrderPosition = function (key, max) {
    this.memory.blueprintsOrderPosition = this.memory.blueprintsOrderPosition || {}

    let position = this.memory.blueprintsOrderPosition[key] || 0
    position =  (position < max) ? position : 0

    this.memory.blueprintsOrderPosition[key] = position + 1
    return position
}


StructureSpawn.prototype.blueprintsOrderPosition = blueprintsOrderPosition
Creep.prototype.blueprintsOrderPosition = blueprintsOrderPosition
StructureTower.prototype.blueprintsOrderPosition = blueprintsOrderPosition
StructureLink.prototype.blueprintsOrderPosition = blueprintsOrderPosition
