/** Browser-safe exports only; never import Node crypto into a client bundle. */
export {
  BOARD_SIZE, WIN_LENGTH, GOMOKU_RULESET_ID, gomokuManifest,
  createInitialState, validateAction, applyAction, getPlayerView, getOutcome,
  type GomokuState, type GomokuMove, type PlaceStoneAction,
  type Stone, type Cell, type GameStatus,
} from "./core";
export {
  createLocalGomokuSession, reduceLocalGomokuSession,
  visibleLocalGomokuState, reconstructLocalHistory,
  type LocalGomokuSession, type LocalSessionAction,
} from "./local-session";
