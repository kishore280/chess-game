import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.token) {
    try {
      res.locals.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET!)
      next()
      return
    } catch {
      res.status(401).json({ error: 'Invalid token' })
      return
    }
  }

  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      res.locals.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!)
      next()
      return
    } catch {
      res.status(401).json({ error: 'Invalid token' })
      return
    }
  }

  res.status(401).json({ error: 'No token' })
}
