import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE, INVALID_MOVE } from "./messages.js";

export class Game{

    public player1: WebSocket;
    public player2: WebSocket;
    public board : Chess;
    private moves : string[];
    private startTime : Date;


    constructor(player1:WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));

    }



    makeMove(socket:WebSocket, move:{
        from: string,
        to: string,
        promotion?: 'q' | 'r' | 'b' | 'n'
    }){
        const turn = this.board.turn();
        if (turn === 'w' && socket!== this.player1) return;
        if (turn === 'b' && socket!== this.player2) return;

        try{
            const result = this.board.move(move);
            const moveMessage = JSON.stringify({
                type: MOVE,
                payload : {
                    move : result,
                    fen : this.board.fen()
                }
            });
            this.player1.send(moveMessage);
            this.player2.send(moveMessage);
        }catch(e){
            socket.send(JSON.stringify({
                type: INVALID_MOVE,
                payload: {message:"This move is invalid"}
            }));
            return;
        }

        const gameEnd = this.board.isGameOver()
        if (gameEnd){
            const winner = this.board.turn() === "w"? "black" : "white";
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {winner}
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {winner}
            }));
        }
    }
}