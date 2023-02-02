let process = require('process'),
    dotenv = require('dotenv'),
    incomingVars = {},
    settings = {
        port : 4311,
        dataFolder : './data'
    },
    getVar = (name)=>{
        if (process.env[name] === undefined)
            return

        incomingVars[name] = process.env[name].toString()    
    },
    fromBool = (settingsName, envVarName)=>{
        if (!incomingVars[envVarName])
            return

        settings[settingsName] = incomingVars[envVarName] === '1' || incomingVars[envVarName].toLowerCase() === 'true'
        console.log(`override variable ${settingsName}`)
    },
    fromString = (settingsName, envVarName)=>{
        if (!incomingVars[envVarName])
            return

        settings[settingsName] = incomingVars[envVarName]
        console.log(`override variable ${settingsName}`)
    },
    fromNumeric = (settingsName, envVarName)=>{
        if (!incomingVars[envVarName])
            return

        const incoming = settings[settingsName] = parseInt(incomingVars[envVarName])
        if (incoming === NaN)
            return

        settings[settingsName] = incoming
        console.log(`override variable ${settingsName}`)
    }

dotenv.config()

fromNumeric('port', 'CRASHREPORT_PORT')

module.exports = settings