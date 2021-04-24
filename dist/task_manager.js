module.exports = {
    process: function() {
        require('task_manager.spawn').process()
        require('task_manager.creep').process()
        require('task_manager.tower').process()
    },
};