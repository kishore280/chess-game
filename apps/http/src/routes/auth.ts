import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validate } from '../middleware/validate'
import { loginSchema, registerSchema } from '../schemas/authSchema'
import { db, users } from '@chess/db'

const router = Router()

router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const [user] = await db.insert(users).values({ username, email, passwordHash }).returning()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
    res.json({ token })
})

router.post('/login', validate(loginSchema), async (req, res) => {
    res.json({ message: "Login successful" })
})

export default router
