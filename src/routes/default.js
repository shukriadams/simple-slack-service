

module.exports = app =>{

    app.get('/', async (req, res)=>{
        res.send('simple-slack-service')
    })  

    /**
     * 
     */
    app.post('/send', async (req, res)=>{
        try {
            
            const settings = require('./../lib/settings'),
                Slack = require('@slack/bolt').App,
                slack = new Slack({
                    signingSecret: settings.secret,
                    token: settings.token
                })

            if (!req.body)
                throw `body not set`

            let messsage = req.body
            messsage.token = settings.token
            
            const result = await slack.client.chat.postMessage(messsage)

            res.send({
                result
            })

        } catch (ex){
            res.status(500)
            res.send(ex.message + ex.stack)
        }
    })

}