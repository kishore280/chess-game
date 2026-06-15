import { WebSocket} from "ws";

export class User{
    public id : string;
    public name: string;
    public socket: WebSocket;

    constructor(socket: WebSocket, userId: string, username: string){
        this.id = userId;
        this.name = username;
        this.socket = socket;
    }

    send(message: Object){
        const connectionOpen = this.socket.readyState === WebSocket.OPEN;
        if (connectionOpen){
            this.socket.send(JSON.stringify(message));
        }
    }
}