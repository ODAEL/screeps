const {BLUEPRINT_CHOOSE_LOGIC_PRIORITY} = require("./container");
const {BlueprintContainer} = require("./container");
const {Blueprint} = require("./blueprint");
const {BLUEPRINT_CHOOSE_LOGIC_ORDER} = require("./container");
const {BlueprintProcessor} = require("./processor");


class BlueprintContainerProcessor {
    constructor(subject) {
        this.subject = subject
    }

    process(blueprintContainer, branchId = 1) {
        if (!this.checkSubject(blueprintContainer.subjectFilter)) {
            return null
        }

        return this.processBlueprints(blueprintContainer.blueprints, blueprintContainer.chooseLogic, branchId)
    }

    checkSubject(subjectFilter) {
        return subjectFilter(this.subject)
    }

    processBlueprints(blueprints, chooseLogic, branchId) {
        let numberOfIterations = 0;
        let task

        do {
            if (numberOfIterations >= blueprints.length) {
                return null
            }

            let index
            if (chooseLogic === BLUEPRINT_CHOOSE_LOGIC_ORDER) {
                index = this.subject.blueprintsOrderPosition(branchId, blueprints.length)
            } else if (chooseLogic === BLUEPRINT_CHOOSE_LOGIC_PRIORITY) {
                index = numberOfIterations
            } else {
                Log.error('Unknown choose logic', chooseLogic)
            }

            let item = blueprints[index]

            if (item instanceof Blueprint) {
                task = BlueprintProcessor.taskByBlueprint(this.subject, item)
            } else if (item instanceof BlueprintContainer) {
                task = this.process(item, branchId * 10 + index)
            } else {
                Log.error('Unknown item type in blueprints', item)
            }

            numberOfIterations++

        } while (!task)

        return task
    }
}

module.exports.BlueprintContainerProcessor = BlueprintContainerProcessor
