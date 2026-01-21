declare enum Suit {
    Spade = 1,// 黑桃 ♠
    Heart = 2,// 红桃 ♥
    Club = 3,// 梅花 ♣
    Diamond = 4
}
declare enum Rank {
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14,
    Two = 15,
    SmallJoker = 16,
    BigJoker = 17
}
declare enum RoomState {
    WAITING = "WAITING",// 等待玩家加入
    READY_CHECK = "READY",// 全员准备阶段
    DEALING = "DEALING",// 发牌动画中
    BIDDING = "BIDDING",// 叫地主阶段
    PLAYING = "PLAYING",// 出牌阶段
    SETTLEMENT = "SETTLEMENT"
}
declare enum PlayerRole {
    SPECTATOR = "SPECTATOR",// 旁观
    PEASANT = "PEASANT",// 农民
    LANDLORD = "LANDLORD"
}
declare enum CardType {
    SINGLE = "SINGLE",// 单张
    PAIR = "PAIR",// 对子
    TRIPLE = "TRIPLE",// 三张
    TRIPLE_WITH_ONE = "TRIPLE_WITH_ONE",// 三带一
    TRIPLE_WITH_PAIR = "TRIPLE_WITH_PAIR",// 三带二
    STRAIGHT = "STRAIGHT",// 顺子
    STRAIGHT_PAIR = "STRAIGHT_PAIR",// 连对
    PLANE = "PLANE",// 飞机
    PLANE_WITH_WING = "PLANE_WITH_WING",// 飞机带翅膀
    BOMB = "BOMB",// 炸弹
    ROCKET = "ROCKET",// 王炸
    INVALID = "INVALID"
}
declare enum SocketEvents {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    EXCEPTION = "exception",// 全局错误处理
    JOIN_ROOM = "room:join",
    LEAVE_ROOM = "room:leave",
    PLAYER_READY = "room:ready",
    ROOM_STATE_CHANGE = "room:state_change",// 广播：房间状态变更
    GAME_START = "game:start",// 广播：游戏开始(发牌)
    BID_LANDLORD = "game:bid",// 请求/广播：叫地主
    PLAY_CARD = "game:play_card",// 请求/广播：出牌
    TURN_CHANGE = "game:turn_change",// 广播：轮到谁出牌
    GAME_OVER = "game:over"
}

declare const CONSTANTS: {
    HAND_CARD_COUNT: number;
    BOTTOM_CARD_COUNT: number;
    MAX_PLAYERS: number;
    TIME_BID: number;
    TIME_PLAY: number;
    TIME_READY: number;
    ROOM_ID_LENGTH: number;
};

interface ICard {
    suit: Suit;
    rank: Rank;
}
interface IPlayerBase {
    userId: string;
    username: string;
    avatar: string;
    coins: number;
    level: number;
    gender: 0 | 1 | 2;
}
interface IGamePlayer extends IPlayerBase {
    socketId: string;
    seatIndex: 0 | 1 | 2;
    isReady: boolean;
    role: PlayerRole;
    handCount: number;
    isOffline: boolean;
    onlineStatus: 'ONLINE' | 'AWAY';
}
interface IRoom {
    id: string;
    state: RoomState;
    players: IGamePlayer[];
    currentTurn: number;
    lastMove?: {
        seatIndex: number;
        cards: ICard[];
        type: CardType;
    };
    landlordSeat?: number;
    baseScore: number;
    multiple: number;
}

interface JoinRoomDto {
    roomId?: string;
}
interface PlayCardDto {
    cards: ICard[];
}
interface BidLandlordDto {
    score: 0 | 1 | 2 | 3;
}
interface GameStartPayload {
    handCards: ICard[];
    bottomCardsCount: number;
    firstTurnSeat: number;
}
interface LandlordConfirmedPayload {
    landlordSeat: number;
    bottomCards: ICard[];
    multiple: number;
}
interface PlayCardBroadcast {
    seatIndex: number;
    cards: ICard[];
    cardType: CardType;
    nextTurnSeat: number;
    isGameOver?: boolean;
}
interface GameOverPayload {
    winnerTeam: string;
    scores: Record<string, number>;
    remainCards: ICard[][];
}
interface ExceptionPayload {
    code: number;
    message: string;
}

declare class PokerHelper {
    static createDeck(): ICard[];
    static shuffle(deck: ICard[]): ICard[];
    static sortCards(cards: ICard[]): ICard[];
    static analyzeCardType(cards: ICard[]): {
        type: CardType;
        value: number;
    };
    static canBeat(prevCards: ICard[], newCards: ICard[]): boolean;
}

export { type BidLandlordDto, CONSTANTS, CardType, type ExceptionPayload, type GameOverPayload, type GameStartPayload, type ICard, type IGamePlayer, type IPlayerBase, type IRoom, type JoinRoomDto, type LandlordConfirmedPayload, type PlayCardBroadcast, type PlayCardDto, PlayerRole, PokerHelper, Rank, RoomState, SocketEvents, Suit };
