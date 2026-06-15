import 'dotenv/config' 
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';
import { WELCOME } from './messages.js';
import { User } from './User.js';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  const protocol = ws.protocol;
  const token = protocol.replace('access_token.', '')

  let decoded: JwtPayload
  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  }catch{
    ws.close(1008, 'Invalid token')
    return
  }
  const user = new User(ws, decoded.userId, decoded.username);
  gameManager.addUser(user);
  ws.on('error', console.error);
  ws.on("close", () => gameManager.removeUser(user));
  user.send({
    type: WELCOME,
    payload: {
      message: 'Welcome to the chess server! You are connected to the server.'
    }
  });
});

console.log('Server is running on port 8080');