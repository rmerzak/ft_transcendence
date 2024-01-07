import { Socket } from "socket.io";

export class SocketContainer {

    private readonly userChatRoomSocket = new Map<number, Map<number,Socket[]>>();


    public addSocket(userId:number,roomId:number,socket:Socket): Map<number,Socket[]> | number{
        if(!this.userChatRoomSocket.has(userId)){
            this.userChatRoomSocket.set(userId,new Map<number,Socket[]>());
        }
        if (roomId == -1 || socket == null) return -1;
        if(!this.userChatRoomSocket.get(userId).has(roomId)){
            this.userChatRoomSocket.get(userId).set(roomId,[]);
        }
        this.userChatRoomSocket.get(userId).get(roomId).push(socket);
        return this.userChatRoomSocket.get(userId);
    }

    public removeSocket(userId:number,roomId:number,socket:Socket): Map<number,Socket[]>{
        if(this.userChatRoomSocket.has(userId)){
            if(this.userChatRoomSocket.get(userId).has(roomId)){
                const index = this.userChatRoomSocket.get(userId).get(roomId).indexOf(socket);
                if(index>-1){
                    this.userChatRoomSocket.get(userId).get(roomId).splice(index,1);
                }
            }
        }
        return this.userChatRoomSocket.get(userId);
    }

    public getSocketsByRoomId(userId:number,roomId:number): Socket[]{
        if(this.userChatRoomSocket.has(userId)){
            if(this.userChatRoomSocket.get(userId).has(roomId)){
                return this.userChatRoomSocket.get(userId).get(roomId);
            }
        }
        return [];
    }

    public getSocketsByUserId(userId:number): Map<number,Socket[]>{
        if(this.userChatRoomSocket.has(userId)){
            return this.userChatRoomSocket.get(userId);
        }
        return new Map<number,Socket[]>();
    }

    public removeSocketFromRoom(userId:number,roomId:number,socket:Socket): Map<number,Socket[]>{
        if(this.userChatRoomSocket.has(userId)){
            if(this.userChatRoomSocket.get(userId).has(roomId)){
                const index = this.userChatRoomSocket.get(userId).get(roomId).indexOf(socket);
                if(index>-1){
                    this.userChatRoomSocket.get(userId).get(roomId).splice(index,1);
                }
            }
        }
        return this.userChatRoomSocket.get(userId);
    }

}