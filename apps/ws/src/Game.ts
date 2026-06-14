import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE, INVALID_MOVE } from "./messages.js";
import type { User } from "./User.js";

export class Game{

    public player1: User;
    public player2: User;
    public board : Chess;
    private moves : string[];
    private startTime : Date;


    constructor(player1:User, player2:User){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send({
            type: INIT_GAME,
            payload: {
                color: "white",
                opponentName: this.player2.name
            }
        });
        this.player2.send({
            type: INIT_GAME,
            payload: {
                color: "black",
                opponentName: this.player1.name
            }
        });

    }



    makeMove(user:User, move:{
        from: string,
        to: string,
        promotion?: 'q' | 'r' | 'b' | 'n'
    }){
        const turn = this.board.turn();
        if (turn === 'w' && user.id!== this.player1.id){
            user.send({
                type: INVALID_MOVE,
                payload : {reason: 'not_your_turn'}
            })
            return;
        } 
        if (turn === 'b' && user.id!== this.player2.id){
            user.send({
                type: INVALID_MOVE,
                payload : {reason: 'not_your_turn'}
            })
            return;
        }
        try{
            const result = this.board.move(move);
            const moveMessage = {
                type: MOVE,
                payload : {
                    move : result,
                    fen : this.board.fen()
                }
            };
            this.player1.send(moveMessage);
            this.player2.send(moveMessage);
            this.moves.push (`${move.from}- ${move.to}`);
        }catch(e){
            user.send({
                type: INVALID_MOVE,
                payload: {reason :"illegal_move"}
            });
            return;
        }

        const gameEnd = this.board.isGameOver()
        if (gameEnd){
            const winner = this.board.turn() === "w"? "black" : "white";
            this.player1.send({
                type: GAME_OVER,
                payload: {winner}
            });
            this.player2.send({
                type: GAME_OVER,
                payload: {winner}
            });
        }
    }
}