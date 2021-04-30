const {Blueprint} = require("./blueprint");
const BLUEPRINT_CHOOSE_LOGIC_ORDER = 'blueprint_choose_logic_order'
const BLUEPRINT_CHOOSE_LOGIC_PRIORITY = 'blueprint_choose_logic_priority'

const BLUEPRINT_CHOOSE_LOGICS = [
    BLUEPRINT_CHOOSE_LOGIC_ORDER,
    BLUEPRINT_CHOOSE_LOGIC_PRIORITY,
]

class BlueprintContainer {
    constructor(...args) {
        // Defaults
        this.chooseLogic = BLUEPRINT_CHOOSE_LOGIC_PRIORITY
        // TODO Change to specific object to use global game state in filtering
        this.subjectFilter = (subject) => true
        this.blueprints = []

        for (let arg of args) {
            if (_.isString(arg) && BLUEPRINT_CHOOSE_LOGICS.indexOf(arg) !== -1) {
                this.chooseLogic = arg
            }

            if (arg instanceof Function) {
                this.subjectFilter = arg
            }

            if (arg instanceof Blueprint) {
                this.blueprints.push(arg)
            }

            if (arg instanceof BlueprintContainer) {
                this.blueprints.push(arg)
            }
        }
    }
}

module.exports.BLUEPRINT_CHOOSE_LOGIC_ORDER = BLUEPRINT_CHOOSE_LOGIC_ORDER
module.exports.BLUEPRINT_CHOOSE_LOGIC_PRIORITY = BLUEPRINT_CHOOSE_LOGIC_PRIORITY
module.exports.BlueprintContainer = BlueprintContainer
