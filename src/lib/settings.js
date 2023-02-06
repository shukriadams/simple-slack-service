let process = require('process'),
    dotenv = require('dotenv'),
    incomingVars = {},
    settings = {
        port : 4311,
        dataFolder : './data',
        logsFolder :'./data/logs',
        trustProxy : false,
        localAuthToken: null,        
        secret: null,
        token: null
    },
    getVar = (name)=>{
        if (process.env[name] === undefined)
            return

        incomingVars[name] = process.env[name].toString()    
    },
    fromBool = (settingsName)=>{

        if (process.env[settingsName] === undefined || process.env[settingsName] === null)
            return

        settings[settingsName] = process.env[settingsName] === '1' || process.env[settingsName].toLowerCase() === 'true'
        console.log(`override variable ${settingsName}`)
    },
    fromString = (settingsName)=>{

        if (!process.env[settingsName])
            return

        settings[settingsName] = process.env[settingsName]
        console.log(`override variable ${settingsName}`)
    },
    fromNumeric = (settingsName)=>{

        if (!process.env[settingsName])
            return

        settings[settingsName] = parseInt(process.env[settingsName])
        console.log(`override variable ${settingsName}`)
    }

dotenv.config()

fromNumeric('port')
fromString('secret')
fromString('token')
fromString('localAuthToken')
fromBool('trustProxy')

module.exports = settings