

module.exports = app =>{

    app.get('/', async (req, res)=>{
        res.send('simple-slack-service')
    })  

    /**
     * 
     */
    app.post('/send', async (req, res)=>{
        const logger = require('./../lib/logger').instance()

        try {
            
            const settings = require('./../lib/settings'),
                fs = require('fs-extra'),
                path = require('path'),
                Slack = require('@slack/bolt').App,
                slack = new Slack({
                    signingSecret: settings.secret,
                    token: settings.token
                })

            if (!req.body)
                throw `body not set`

            let messsage = req.body
            messsage.token = settings.token
            logger.info({
                message : req.body,
                ip : req.ip
            })

            if (settings.localAuthToken){
                let token = req.header('Authorization'),
                    authPassed = false

                if (token){
                    token = token.trim()
                    let matches = token.match(/bearer (.*)/i)
                    if (matches && matches.length === 2)
                        token = matches.pop()

                        if (token === settings.localAuthToken)
                            authPassed = true
                }

                if (!authPassed){
                    res.status(401)
                    res.send('unauthorized')
                    return
                }
            }

            const result = await slack.client.chat.postMessage(messsage)

            res.send({
                result
            })

        } catch (ex){
            res.status(500)
            res.send(ex)
            logger.error({
                ex,
                message : req.body
            })
        }
    })

}