import Router from 'express'

const router =  Router()

router.post('/register',(req,res)=>{
    const {username, email, password} = req.body



    res.json({
        message: "Resgistered"
    })


})


router.post('/login', (req,res)=>{



    res.json({
        message: "Login succesfull"
    })

})


export default router