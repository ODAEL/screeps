const needConsoleLog = (object) => {
    return object && object.memory && object.memory.debug;
}

const stringifyData = (data) => (_.map(data, (item) => JSON.stringify(item))).join('\n')

module.exports = {
    debug: (object, ...data) => {
        needConsoleLog(object) && console.log('DEBUG', stringifyData([...data]));
    },
    error: (...data) => {
        console.log('ERROR', stringifyData(data));
    },
    info: (...data) => {
        console.log('INFO', stringifyData(data));
    },
};
