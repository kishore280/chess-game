import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import cookieParser from 'cookie-parser'
import { requireAuth } from './middleware/requireAuth.js'
import { db, users, eq } from '@chess/db'

const PORT = 3001
const app = express();
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)

app.get('/',(req,res)=>{
    res.send("hi")
})

app.get('/me', requireAuth, async (req, res)=>{
    const { userId } = res.locals.user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    res.json({ username: user.username, email: user.email })
})

app.get('/health', (req, res)=>{
    res.json({
        time:Date.now() 
    })
})


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})
