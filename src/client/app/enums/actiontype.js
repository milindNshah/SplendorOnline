/* Should be kept in sync with ActionType(game.ts) on server */
export const ActionType = {
  START_GAME: "StartGame",
  JOIN_GAME: "JoinGame",
  TAKE_GEMS: "TakeGems",
  PURCHASE_ACTIVE_CARD: "PurchaseActiveCard",
  PURCHASE_RESERVED_CARD: "PurchaseReservedCard",
  RESERVE_ACTIVE_CARD: "ReserveActiveCard",
  RESERVE_DECK_CARD: "ReserveDeckCard",
  NEW_ACTIVE_CARD: "NewActiveCard",
  OBTAIN_NOBLE: "ObtainNoble",
  SKIP_TURN: "SkipTurn",
  LEAVE_GAME: "LeaveGame",
  GAME_ENDED: "GameEnded",
}
