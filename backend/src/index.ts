import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';
import { WELCOME } from './messages.js';
import { User } from './User.js';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  const user = new User(ws);
  gameManager.addUser(user);
  ws.on('error', console.error);
  ws.on("close", () => gameManager.removeUser(user));
  ws.send(JSON.stringify({
    type: WELCOME,
    payload: {
      message: 'Welcome to the chess server! You are connected to the server.'
    }
  }));
});

console.log('Server is running on port 8080');