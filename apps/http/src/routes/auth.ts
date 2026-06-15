import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { db, users, eq } from "@chess/db";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const [user] = await db.insert(users).values({ username, email, passwordHash }).returning();
    const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET!);
    res.cookie('token', token, { httpOnly: true })
    res.json({ message: 'Registered successfully' });
  } catch (e: any) {
    if (e?.message?.includes('unique')) {
      res.status(409).json({ error: 'Email or username already taken' })
    } else {
      res.status(500).json({ error: 'Registration failed' })
    }
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!user) { res.status(404).json({ error: "User not found" }); return }
  const passCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passCorrect) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET!);
  res.cookie('token', token, {httpOnly:true});
  res.json({ message: "Login successful" });
});

router.post("/logout", (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

export default router;
