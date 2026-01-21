import {Injectable} from "@nestjs/common";
import {CONSTANTS, IGamePlayer, IRoom, PlayerRole, RoomState} from "@ddz/shared";
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class RoomManager {
    private rooms: Map<string, IRoom> = new Map();
    private playerRoomMap: Map<string, string> = new Map()

    createRoom(): IRoom {
        const roomId = this.generateRoomId();
        const newRoom: IRoom = {
            id: roomId,
            state: RoomState.WAITING,
            players: [],
            currentTurn: -1,
            baseScore: 0,
            multiple: 1
        }

        this.rooms.set(roomId, newRoom);
        return newRoom;
    }

    joinRoom(socketId: string, playerInfo: Partial<IGamePlayer>, roomId?: string): IRoom {
        let room: IRoom | undefined;
        if (roomId) {
            room = this.rooms.get(roomId);
            if (!room) throw new Error('房间不存在')
        } else {
            for (const r of this.rooms.values()) {
                if (r.state === RoomState.WAITING && r.players.length < CONSTANTS.MAX_PLAYERS) {
                    room = r;
                    break;
                }
            }
            if (!room) {
                room = this.createRoom();
            }
        }

        if (room.players.length >= CONSTANTS.MAX_PLAYERS) {
            throw new Error('房间已满');
        }

        const newPlayer: IGamePlayer = {
            userId: playerInfo.userId || uuidv4(),
            username: playerInfo.username || `玩家${Math.floor(Math.random() * 1000)}`,
            avatar: playerInfo.avatar || 'default.png',
            gender: playerInfo.gender || 0,
            coins: 1000,
            level: 1,
            socketId: socketId,
            seatIndex: this.assignSeat(room),
            isReady: false,
            role: PlayerRole.PEASANT,
            handCount: 0,
            isOffline: false,
            onlineStatus: 'ONLINE'
        }

        room.players.push(newPlayer);
        this.playerRoomMap.set(socketId, room.id);

        return room;
    }

    leaveRoom(socketId: string): IRoom | null {
        const roomId = this.playerRoomMap.get(socketId);
        if (!roomId) return null;

        const room = this.rooms.get(roomId);
        if (room) {
            room.players = room.players.filter(p => p.socketId !== socketId);
            if (room.players.length === 0) {
                this.rooms.delete(roomId);
            }

            this.playerRoomMap.delete(socketId);
            return room;
        }

        return null
    }

    getRoomBySocketId(socketId: string): IRoom | undefined {
        const roomId = this.playerRoomMap.get(socketId);
        if (!roomId) return undefined;
        return this.rooms.get(roomId);
    }

    private generateRoomId(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private assignSeat(room: IRoom): 0 | 1 | 2 {
        const takenSeats = room.players.map(p => p.seatIndex);
        if (!takenSeats.includes(0)) return 0;
        if (!takenSeats.includes(1)) return 1;
        return 2;
    }
}

