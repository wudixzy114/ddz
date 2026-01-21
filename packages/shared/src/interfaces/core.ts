import {Rank, Suit, PlayerRole, CardType, RoomState} from "../enums";

export interface ICard {
    suit: Suit;
    rank: Rank;
}

export interface IPlayerBase {
    userId: string;
    username: string;
    avatar: string;
    coins: number;
    level: number;
    gender: 0 | 1 | 2;
}

export interface IGamePlayer extends IPlayerBase {
    socketId: string;
    seatIndex: 0 | 1 | 2;
    isReady: boolean;
    role: PlayerRole;
    handCount: number;
    cards: ICard[];
    isOffline: boolean;
    onlineStatus: 'ONLINE' | 'AWAY';
}

export interface IRoom {
    id: string;
    state: RoomState;
    players: IGamePlayer[];
    currentTurn: number;
    lastMove?: {
        seatIndex: number;
        cards: ICard[];
        type: CardType;
    }
    landlordSeat?: number;
    baseScore: number;
    multiple: number;
}