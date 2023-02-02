module.exports = async express =>{
    const path = require('path'),
        fs = require('fs-extra')

    const routeFiles = await fs.readdir(path.join(__dirname, '/../routes'))
    for (const routeFile of routeFiles){
        const routeFileName = routeFile.match(/(.*).js/).pop(),
            route = require(`./../routes/${routeFileName}`)

        route(express)
    }
}