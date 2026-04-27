import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws)
  ws.on('error', console.error);
  ws.on("close", () => gameManager.removeUser(ws))
  ws.send('welcome');
});

console.log('Server is running on port 8080');