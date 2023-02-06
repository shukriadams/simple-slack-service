let _global

module.exports = {
   

    // returns an instance of the global log
    instance(){
        const winstonWrapper = require('winston-wrapper'),
            settings = require('./settings')

        if (!_global)
            _global = winstonWrapper.new(settings.logsFolder, 'info').log

        return _global
    },

}