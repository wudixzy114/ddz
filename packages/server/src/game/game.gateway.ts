import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import {RoomManager} from "./room.manager";
import {Server, Socket} from "socket.io";
import {ExceptionPayload, type JoinRoomDto, SocketEvents} from "@ddz/shared";

@WebSocketGateway({cors: {origin: '*'}})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly roomManager: RoomManager) {
    }

    handleConnection(client: Socket): any {
        const token = client.handshake.query.token;
        // TODO token check
        console.log(`Client connected: ${client.id}, Token: ${token}`);
    }

    handleDisconnect(client: Socket): any {
        console.log(`Client disconnected: ${client.id}`);
        const room = this.roomManager.leaveRoom(client.id);
        if (room && room.players.length > 0) {
            client.to(room.id).emit(SocketEvents.LEAVE_ROOM, {userId: client.id});
        }
    }

    @SubscribeMessage(SocketEvents.JOIN_ROOM)
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: JoinRoomDto
    ) {
        try {
            // TODO
            const mockUser = {
                userId: client.handshake.query.userId as string,
                username: `User-${client.id.slice(0, 4)}`
            };
            const room = this.roomManager.joinRoom(client.id, mockUser, payload.roomId);
            client.join(room.id);


            client.to(room.id).emit(SocketEvents.JOIN_ROOM, {newPlayer: room.players.find(p => p.socketId === client.id)});
            client.emit(SocketEvents.JOIN_ROOM, {room});

            console.log(`Player ${client.id} joined room ${room.id}`);
        } catch (error: any) {
            const ex: ExceptionPayload = {
                code: 400,
                message: error.message || 'Unknown error'
            };
            client.emit(SocketEvents.EXCEPTION, ex);
        }
    }

    @SubscribeMessage(SocketEvents.PLAYER_READY)
    handleReady(@ConnectedSocket() client: Socket) {
        try {
            const {room, isAllReady} = this.roomManager.playerReady(client.id);
            this.server.to(room.id).emit(SocketEvents.PLAYER_READY, {userId: client.userId})
            if (isAllReady) {
                const payloads = this.roomManager.startGame(room.id);
                Object.keys(payloads).forEach(socketId => {
                    this.server.to(socketId).emit(SocketEvents.GAME_START, payloads[socketId]);
                });
                console.log(`Room ${room.id} Game Start!`);
            }
        } catch (e) {
            // error handling
        }
    }
}