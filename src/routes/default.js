

module.exports = app =>{

    /**
     * 
     */
    app.get('/', async (req, res)=>{
        try {

            res.send('test')

        } catch (ex){
            res.status(500)
            res.send(ex.message + ex.stack)
        }
    })

}