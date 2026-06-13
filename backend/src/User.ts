import { WebSocket} from "ws";
import {randomUUID} from "crypto";

export class User{
    public id : string;
    public name: string;
    public socket: WebSocket;


    constructor(socket: WebSocket, name?: string){
        this.id = randomUUID();
        this.name = name?? 'guest';
        this. socket = socket;
    }

    send(message: Object){
        const connectionOpen = this.socket.readyState === WebSocket.OPEN;
        if (connectionOpen){
            this.socket.send(JSON.stringify(message));
        }
    }
}