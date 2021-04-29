const {Task} = require("./tasks");
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
        return Task.getTaskObject(task)
    },
}

Object.defineProperty(StructureSpawn.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(Creep.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(StructureTower.prototype, 'currentTask', currentTaskAttributes);
Object.defineProperty(StructureLink.prototype, 'currentTask', currentTaskAttributes);


const endCurrentTask = () => {
    if (this.memory.tasks.length === 0) {
        return
    }

    this.memory.tasks.splice(0, 1);
}

StructureSpawn.prototype.endCurrentTask = endCurrentTask
Creep.prototype.endCurrentTask = endCurrentTask
StructureTower.prototype.endCurrentTask = endCurrentTask
StructureLink.prototype.endCurrentTask = endCurrentTask
