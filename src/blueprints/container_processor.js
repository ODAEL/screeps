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

        if (blueprintContainer.subContainers.length !== 0) {
            // Ignore other settings
            return this.processContainers(blueprintContainer.subContainers, branchId)
        }

        return this.processBlueprints(blueprintContainer.blueprints, blueprintContainer.chooseLogic, branchId)
    }

    checkSubject(subjectFilter) {
        return subjectFilter(this.subject)
    }

    processContainers(subContainers, branchId) {
        // TODO Maybe support order?
        for (let i = 0; i < subContainers.length; i++) {
            let container = subContainers[i]
            // Is needed for correct processing of order logic
            let task = this.process(container, branchId * 10 + i)
            if (task) {
                return task
            }
        }

        return null
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
            } else {
                index = numberOfIterations
            }

            task = BlueprintProcessor.taskByBlueprint(this.subject, blueprints[index])

            numberOfIterations++

        } while (!task)

        return task
    }
}

module.exports.BlueprintContainerProcessor = BlueprintContainerProcessor
