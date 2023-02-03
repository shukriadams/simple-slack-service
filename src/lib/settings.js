let process = require('process'),
    dotenv = require('dotenv'),
    incomingVars = {},
    settings = {
        port : 4311,
        dataFolder : './data',
        secret: null,
        token: null
    },
    getVar = (name)=>{
        if (process.env[name] === undefined)
            return

        incomingVars[name] = process.env[name].toString()    
    },
    fromBool = (settingsName, envVarName)=>{

        settings[settingsName] = incomingVars[envVarName] === '1' || incomingVars[envVarName].toLowerCase() === 'true'
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

module.exports = settings