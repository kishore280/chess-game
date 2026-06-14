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
  const [user] = await db
    .insert(users)
    .values({ username, email, passwordHash })
    .returning();
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
  res.json({ token });
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
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
  res.json({ message: "Login successful", token });
});

export default router;
