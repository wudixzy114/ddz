// src/enums.ts
var Suit = /* @__PURE__ */ ((Suit2) => {
  Suit2[Suit2["Spade"] = 1] = "Spade";
  Suit2[Suit2["Heart"] = 2] = "Heart";
  Suit2[Suit2["Club"] = 3] = "Club";
  Suit2[Suit2["Diamond"] = 4] = "Diamond";
  return Suit2;
})(Suit || {});
var Rank = /* @__PURE__ */ ((Rank2) => {
  Rank2[Rank2["Three"] = 3] = "Three";
  Rank2[Rank2["Four"] = 4] = "Four";
  Rank2[Rank2["Five"] = 5] = "Five";
  Rank2[Rank2["Six"] = 6] = "Six";
  Rank2[Rank2["Seven"] = 7] = "Seven";
  Rank2[Rank2["Eight"] = 8] = "Eight";
  Rank2[Rank2["Nine"] = 9] = "Nine";
  Rank2[Rank2["Ten"] = 10] = "Ten";
  Rank2[Rank2["Jack"] = 11] = "Jack";
  Rank2[Rank2["Queen"] = 12] = "Queen";
  Rank2[Rank2["King"] = 13] = "King";
  Rank2[Rank2["Ace"] = 14] = "Ace";
  Rank2[Rank2["Two"] = 15] = "Two";
  Rank2[Rank2["SmallJoker"] = 16] = "SmallJoker";
  Rank2[Rank2["BigJoker"] = 17] = "BigJoker";
  return Rank2;
})(Rank || {});
var RoomState = /* @__PURE__ */ ((RoomState2) => {
  RoomState2["WAITING"] = "WAITING";
  RoomState2["READY_CHECK"] = "READY";
  RoomState2["DEALING"] = "DEALING";
  RoomState2["BIDDING"] = "BIDDING";
  RoomState2["PLAYING"] = "PLAYING";
  RoomState2["SETTLEMENT"] = "SETTLEMENT";
  return RoomState2;
})(RoomState || {});
var PlayerRole = /* @__PURE__ */ ((PlayerRole2) => {
  PlayerRole2["SPECTATOR"] = "SPECTATOR";
  PlayerRole2["PEASANT"] = "PEASANT";
  PlayerRole2["LANDLORD"] = "LANDLORD";
  return PlayerRole2;
})(PlayerRole || {});
var CardType = /* @__PURE__ */ ((CardType2) => {
  CardType2["SINGLE"] = "SINGLE";
  CardType2["PAIR"] = "PAIR";
  CardType2["TRIPLE"] = "TRIPLE";
  CardType2["TRIPLE_WITH_ONE"] = "TRIPLE_WITH_ONE";
  CardType2["TRIPLE_WITH_PAIR"] = "TRIPLE_WITH_PAIR";
  CardType2["STRAIGHT"] = "STRAIGHT";
  CardType2["STRAIGHT_PAIR"] = "STRAIGHT_PAIR";
  CardType2["PLANE"] = "PLANE";
  CardType2["PLANE_WITH_WING"] = "PLANE_WITH_WING";
  CardType2["BOMB"] = "BOMB";
  CardType2["ROCKET"] = "ROCKET";
  CardType2["INVALID"] = "INVALID";
  return CardType2;
})(CardType || {});
var SocketEvents = /* @__PURE__ */ ((SocketEvents2) => {
  SocketEvents2["CONNECT"] = "connect";
  SocketEvents2["DISCONNECT"] = "disconnect";
  SocketEvents2["EXCEPTION"] = "exception";
  SocketEvents2["JOIN_ROOM"] = "room:join";
  SocketEvents2["LEAVE_ROOM"] = "room:leave";
  SocketEvents2["PLAYER_READY"] = "room:ready";
  SocketEvents2["ROOM_STATE_CHANGE"] = "room:state_change";
  SocketEvents2["GAME_START"] = "game:start";
  SocketEvents2["BID_LANDLORD"] = "game:bid";
  SocketEvents2["PLAY_CARD"] = "game:play_card";
  SocketEvents2["TURN_CHANGE"] = "game:turn_change";
  SocketEvents2["GAME_OVER"] = "game:over";
  return SocketEvents2;
})(SocketEvents || {});

// src/constants.ts
var CONSTANTS = {
  // 游戏规则配置
  HAND_CARD_COUNT: 17,
  // 初始手牌
  BOTTOM_CARD_COUNT: 3,
  // 底牌
  MAX_PLAYERS: 3,
  // 最大玩家数
  // 时间限制 (毫秒)
  TIME_BID: 15e3,
  // 叫地主超时
  TIME_PLAY: 2e4,
  // 出牌超时
  TIME_READY: 3e4,
  // 准备超时
  // 房间配置
  ROOM_ID_LENGTH: 6
  // 房间号长度
};
export {
  CONSTANTS,
  CardType,
  PlayerRole,
  Rank,
  RoomState,
  SocketEvents,
  Suit
};
//# sourceMappingURL=index.mjs.map