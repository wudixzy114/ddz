export enum Suit {
    Spade = 1,   // 黑桃 ♠
    Heart = 2,   // 红桃 ♥
    Club = 3,    // 梅花 ♣
    Diamond = 4, // 方片 ♦
}

export enum Rank {
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
    BigJoker = 17,
}

export enum RoomState {
    WAITING = 'WAITING',      // 等待玩家加入
    READY_CHECK = 'READY',    // 全员准备阶段
    DEALING = 'DEALING',      // 发牌动画中
    BIDDING = 'BIDDING',      // 叫地主阶段
    PLAYING = 'PLAYING',      // 出牌阶段
    SETTLEMENT = 'SETTLEMENT' // 结算阶段
}

export enum PlayerRole {
    SPECTATOR = 'SPECTATOR', // 旁观
    PEASANT = 'PEASANT',     // 农民
    LANDLORD = 'LANDLORD',   // 地主
}

export enum CardType {
    SINGLE = 'SINGLE',           // 单张
    PAIR = 'PAIR',               // 对子
    TRIPLE = 'TRIPLE',           // 三张
    TRIPLE_WITH_ONE = 'TRIPLE_WITH_ONE', // 三带一
    TRIPLE_WITH_PAIR = 'TRIPLE_WITH_PAIR', // 三带二
    QUADPLEX_WITH_SINGLE = 'QUADPLEX_WITH_SINGLE', // 四带两张单牌
    QUADPLEX_WITH_PAIR = 'QUADPLEX_WITH_PAIR', // 四带两对
    STRAIGHT = 'STRAIGHT',       // 顺子
    STRAIGHT_PAIR = 'STRAIGHT_PAIR', // 连对
    PLANE = 'PLANE',             // 飞机
    PLANE_WITH_SINGLE = 'PLANE_WITH_SINGLE', // 飞机带单张
    PLANE_WITH_PAIR = 'PLANE_WITH_PAIR', // 飞机带两对
    BOMB = 'BOMB',               // 炸弹
    ROCKET = 'ROCKET',           // 王炸
    INVALID = 'INVALID',         // 非法牌型
}

export enum SocketEvents {
    // Connection
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    EXCEPTION = 'exception', // 全局错误处理

    // Room
    JOIN_ROOM = 'room:join',
    LEAVE_ROOM = 'room:leave',
    PLAYER_READY = 'room:ready',
    ROOM_STATE_CHANGE = 'room:state_change', // 广播：房间状态变更

    // Game Logic
    GAME_START = 'game:start',         // 广播：游戏开始(发牌)
    BID_LANDLORD = 'game:bid',         // 请求/广播：叫地主
    PLAY_CARD = 'game:play_card',      // 请求/广播：出牌
    TURN_CHANGE = 'game:turn_change',  // 广播：轮到谁出牌
    GAME_OVER = 'game:over',           // 广播：结算
}
