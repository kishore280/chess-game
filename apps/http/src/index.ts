import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import cookieParser from 'cookie-parser'
import { requireAuth } from './middleware/requireAuth.js'

const PORT = 3001
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)

app.get('/',(req,res)=>{
    res.send("hi")
})

app.get('/me', requireAuth, (req, res)=>{
    const { userId, username, email } = res.locals.user
    res.json({ userId, username, email, token: req.cookies.token })
})

app.get('/health', (req, res)=>{
    res.json({
        time:Date.now() 
    })
})


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})
