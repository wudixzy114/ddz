import {ICard} from "./core";
import {CardType} from "../enums";

// --- Requests (Client -> Server) ---

export interface JoinRoomDto {
    roomId?: string;
}

export interface PlayCardDto {
    cards: ICard[];
}

export interface BidLandlordDto {
    score: 0 | 1 | 2 | 3;
}

// --- Responses / Broadcasts (Server -> Client) ---

export interface GameStartPayload {
    handCards: ICard[];
    bottomCardsCount: number;
    firstTurnSeat: number;
}

export interface LandlordConfirmedPayload {
    landlordSeat: number;
    bottomCards: ICard[];
    multiple: number;
}

export interface PlayCardBroadcast {
    seatIndex: number;
    cards: ICard[];
    cardType: CardType;
    nextTurnSeat: number;
    isGameOver?: boolean;
}

export interface GameOverPayload {
    winnerTeam: string;
    scores: Record<string, number>;
    remainCards: ICard[][];
}

export interface ExceptionPayload {
    code: number;
    message: string;
}

