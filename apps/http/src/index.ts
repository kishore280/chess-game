import express from 'express'
import cors from 'cors'

const PORT = 3001
const app = express();
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("hi")
})

app.get('/health', (req, res)=>{
    res.json({
        time:Date.now() 
    })
})


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

