(async()=>{
    try {

        const http = require('http'),
            fs = require('fs-extra'),
            Express = require('express'),
            routeLoader = require('./lib/routeLoader'),
            settings = require('./lib/settings')

        await fs.ensureDir('./data/logs')

        const express = Express()
        express.set('json spaces', 4)

        await routeLoader(express)
        
        const server = http.createServer(express)
        server.listen(settings.port)
        console.log(`Listening on port ${settings.port}`)

    } catch(ex){
        console.log(ex)
    }

})()