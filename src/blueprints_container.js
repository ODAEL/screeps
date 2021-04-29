const {BlueprintManager} = require("./blueprints");
const {MemoryManager} = require("./memory_manager");
const BLUEPRINT_CHOOSE_LOGIC_ORDER = 'blueprint_choose_logic_order'
const BLUEPRINT_CHOOSE_LOGIC_PRIORITY = 'blueprint_choose_logic_priority'

const BLUEPRINT_CHOOSE_LOGICS = [
    BLUEPRINT_CHOOSE_LOGIC_ORDER,
    BLUEPRINT_CHOOSE_LOGIC_PRIORITY,
]

class BlueprintsContainer {
    // TODO Separate tasks choosing and logic containing
    constructor(...args) {
        // Defaults
        this.chooseLogic = BLUEPRINT_CHOOSE_LOGIC_ORDER
        // TODO Change to specific object to use global game state in filtering
        this.subjectFilter = (subject) => true
        this.blueprints = []
        this.containers = []

        for (let arg of args) {
            if (_.isString(arg) && BLUEPRINT_CHOOSE_LOGICS.indexOf(arg) !== -1) {
                this.chooseLogic = arg
            }

            if (arg instanceof Function) {
                this.subjectFilter = arg
            }

            if (arg instanceof Array) {
                this.blueprints = arg
            }

            if (arg instanceof BlueprintsContainer) {
                this.containers.push(arg)
            }
        }
    }

    chooseTask(subject, branchId = 1) {
        if (!this.checkSubject(subject)) {
            return null
        }

        if (this.containers.length !== 0) {
            // Ignore other settings
            return this.processContainers(subject, branchId)
        }

        return this.processBlueprints(subject, branchId)
    }

    checkSubject(subject) {
        return this.subjectFilter(subject)
    }

    processContainers(subject, branchId) {
        // TODO Maybe support order?
        for (let i = 0; i < this.containers.length; i++) {
            let container = this.containers[i]
            // Is needed for correct processing of order logic
            let task = container.chooseTask(subject, branchId * 10 + i)
            if (task) {
                return task
            }
        }

        return null
    }

    processBlueprints(subject, branchId) {
        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations >= this.blueprints.length) {
                return null
            }

            let index
            if (this.chooseLogic === BLUEPRINT_CHOOSE_LOGIC_ORDER) {
                index = MemoryManager.blueprintsOrderPosition(subject.id + '_' + branchId, this.blueprints.length)
            } else {
                index = numberOfIterations
            }

            task = BlueprintManager.taskByBlueprint(subject, this.blueprints[index])

            numberOfIterations++

        } while (!task)

        return task
    }
}

module.exports.BLUEPRINT_CHOOSE_LOGIC_ORDER = BLUEPRINT_CHOOSE_LOGIC_ORDER
module.exports.BLUEPRINT_CHOOSE_LOGIC_PRIORITY = BLUEPRINT_CHOOSE_LOGIC_PRIORITY
module.exports.BlueprintsContainer = BlueprintsContainer
