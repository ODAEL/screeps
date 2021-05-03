class MarketManager {
    constructor(roomName) {
        this.roomName = roomName
    }

    getAllOrders(filter) {
        let allOrders = Game.market.getAllOrders(filter)

        for (let i = 0; i < allOrders.length; i++) {
            allOrders[i].transactionCostPerUnit = Game.market.calcTransactionCost(10000, this.roomName, allOrders[i].roomName) / 10000
        }

        return allOrders
    }

    ensureMemory() {
        if (!Memory.market) {
            Memory.market = {}
        }
    }

    getEnergyBestSell() {
        let allOrders = Game.market.getAllOrders({resourceType: RESOURCE_ENERGY, type: ORDER_SELL})
        for (let i = 0; i < allOrders.length; i++) {
            let transactionCostPerUnit = Game.market.calcTransactionCost(10000, this.roomName, allOrders[i].roomName) / 10000
            allOrders[i].transactionCostPerUnit = transactionCostPerUnit
            allOrders[i].realPrice = allOrders[i].price / (1 - transactionCostPerUnit)
        }

        return _.min(allOrders, (order) => order.realPrice)
    }

    getEnergyBestBuy() {
        let allOrders = Game.market.getAllOrders({resourceType: RESOURCE_ENERGY, type: ORDER_BUY})
        let bestSellOrder = this.getEnergyBestSell()
        for (let i = 0; i < allOrders.length; i++) {
            let transactionCostPerUnit = Game.market.calcTransactionCost(10000, this.roomName, allOrders[i].roomName) / 10000
            allOrders[i].transactionCostPerUnit = transactionCostPerUnit
            allOrders[i].realPrice = allOrders[i].price - transactionCostPerUnit * bestSellOrder.realPrice
        }

        return _.max(allOrders, (order) => order.realPrice)
    }
}

module.exports.MarketManager = MarketManager
