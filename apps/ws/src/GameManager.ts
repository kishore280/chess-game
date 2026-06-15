import { WebSocket } from "ws";
import { INIT_GAME, MOVE, WAITING_FOR_OPPONENT, OPPONENT_DISCONNECTED } from "./messages.js";
import { Game } from "./Game.js";
import { User } from "./User.js";


export class GameManager {
    private games : Game[];
    private pendingUser: User | null;
    private users : User[];

    
    constructor(){
        this.games = []
        this.pendingUser = null;
        this.users = [];
    }

    addUser(user: User){
        this.users.push(user);
        this.addHandler(user);

    }

    removeUser(user : User){
        this.users = this.users.filter(u => u.id!= user.id);
        if(user.id === this.pendingUser?.id){
            this.pendingUser = null;
        }
        const game = this.games.find(g => g.player1.id === user.id || g.player2.id === user.id);
        if (game) {
            const opponent = game.player1.id === user.id ? game.player2 : game.player1;
            opponent.send({ type: OPPONENT_DISCONNECTED });
            this.games = this.games.filter(g => g !== game);
        }
    }

    private addHandler(user: User){
        user.socket.on("message",(data)=>{
            let message;
            try{
                message = JSON.parse(data.toString());
            }catch(e){
                return;
            }
if (message.type === INIT_GAME){
            if (this.pendingUser && this.pendingUser?.id!=user.id){
                const game = new Game(this.pendingUser, user)
                this.games.push(game);
                this.pendingUser = null
            }else{
                this.pendingUser = user;
                user.send(
                    {type: WAITING_FOR_OPPONENT},
                );
            }

        }

        if (message.type === MOVE){
            const game = this.games.find(game => game.player1.id === user.id || game.player2.id === user.id);
            if (game){
                game.makeMove(user, message.move)
                if (game.board.isGameOver()){
                    this.games = this.games.filter(g => g !== game);
                }
            }
        }
        })
    }

}