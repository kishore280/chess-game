import { WebSocket } from "ws";
import { INIT_GAME, MOVE, WAITING_FOR_OPPONENT } from "./messages.js";
import { Game } from "./Game.js";


export class GameManager {
    private games : Game[];
    private pendinguser: WebSocket | null;
    private users : WebSocket[];

    
    constructor(){
        this.games = []
        this.pendinguser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket)

    }

    removeUser(socket : WebSocket){
        this.users = this.users.filter(user => user!= socket);

    }

    private addHandler(socket: WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME){
                if (this.pendinguser){
                    const game = new Game(this.pendinguser, socket)
                    this.games.push(game);
                    this.pendinguser = null;
                }else{
                    this.pendinguser = socket;
                    socket.send(JSON.stringify({
                        type: WAITING_FOR_OPPONENT
                    }));
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game=> game.player1 === socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket, message.move);
                }

            }
        })

    }


    

}