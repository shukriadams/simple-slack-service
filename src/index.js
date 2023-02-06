(async()=>{
    try {

        const http = require('http'),
            fs = require('fs-extra'),
            Express = require('express'),
            bodyParser = require('body-parser'),
            routeLoader = require('./lib/routeLoader'),
            settings = require('./lib/settings')

        await fs.ensureDir(settings.logsFolder)

        const express = Express()
        express.set('json spaces', 4)
        
        if (settings.trustProxy)
            express.set('trust proxy', true)

        express.use(bodyParser.urlencoded({ }))
        express.use(bodyParser.json())

        await routeLoader(express)
        
        const server = http.createServer(express)
        server.listen(settings.port)
        console.log(`Listening on port ${settings.port}`)

    } catch(ex){
        console.log(ex)
    }

})()