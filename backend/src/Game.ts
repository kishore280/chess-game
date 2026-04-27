import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";

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



    makeMove(socket:WebSocket, move: {
        from: string;
        to : string;
    }){
        const currentTurn = this.board.turn();
        const isWhiteTurn = currentTurn === "w";
        const isPlayer1Turn = isWhiteTurn; // player1 is white, player2 is black

        if ((isPlayer1Turn && socket !== this.player1) || (!isPlayer1Turn && socket !== this.player2)) {
            return;
        }

        let moveResult;
        try {
            moveResult = this.board.move(move)
        } catch (e) {
            return
        }

        this.moves.push(`${move.from}-${move.to}`);

        const moveMessage = JSON.stringify({
            type: MOVE,
            payload: {
                move: moveResult,
                fen: this.board.fen(),
                turn: this.board.turn() === "w" ? "white" : "black"
            }
        });

        this.player1.send(moveMessage);
        this.player2.send(moveMessage);

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload:{
                    winner:this.board.turn()=== "w"? "black":"white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload:{
                    winner:this.board.turn()=== "w"? "black":"white"
                }
            }))
            return;
        }
        


    }
}