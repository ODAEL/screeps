const BLUEPRINT_CHOOSE_LOGIC_ORDER = 'blueprint_choose_logic_order'
const BLUEPRINT_CHOOSE_LOGIC_PRIORITY = 'blueprint_choose_logic_priority'

const BLUEPRINT_CHOOSE_LOGICS = [
    BLUEPRINT_CHOOSE_LOGIC_ORDER,
    BLUEPRINT_CHOOSE_LOGIC_PRIORITY,
]

class BlueprintContainer {
    constructor(...args) {
        // Defaults
        this.chooseLogic = BLUEPRINT_CHOOSE_LOGIC_ORDER
        // TODO Change to specific object to use global game state in filtering
        this.subjectFilter = (subject) => true
        this.blueprints = []
        this.subContainers = []

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

            if (arg instanceof BlueprintContainer) {
                this.subContainers.push(arg)
            }
        }
    }
}

module.exports.BLUEPRINT_CHOOSE_LOGIC_ORDER = BLUEPRINT_CHOOSE_LOGIC_ORDER
module.exports.BLUEPRINT_CHOOSE_LOGIC_PRIORITY = BLUEPRINT_CHOOSE_LOGIC_PRIORITY
module.exports.BlueprintContainer = BlueprintContainer
