/**
 * Gomoku / Cờ caro: freestyle 15×15, 5-or-more-in-a-row wins.
 * DEV/CI candidate. This is a pure in-process rules engine, not an online game.
 * The server must authenticate players and persist/attest every accepted move.
 */
import {
  assertAllowed,
  type ActionValidation,
  type GameActionErrorCode,
  type GameManifest,
} from "@bgu/game-sdk";

export const BOARD_SIZE = 15;
export const WIN_LENGTH = 5;
export const GOMOKU_RULESET_ID = "gomoku.freestyle.15x15.v1";

export type Stone = "black" | "white";
export type Cell = Stone | null;
export type GameStatus = "active" | "won" | "draw";

export interface GomokuMove {
  readonly seq: number;
  readonly player: Stone;
  readonly row: number;
  readonly col: number;
  readonly commandId: string;
}

export interface GomokuState {
  readonly schemaVersion: 1;
  readonly rulesetId: typeof GOMOKU_RULESET_ID;
  readonly seed: string;
  readonly board: readonly Cell[];
  readonly history: readonly GomokuMove[];
  readonly revision: number;
  readonly nextPlayer: Stone | null;
  readonly status: GameStatus;
  readonly winner: Stone | null;
}

export interface PlaceStoneAction {
  readonly type: "place_stone";
  /** Claimed side only; real identity/seat is checked by an authorized server. */
  readonly player: Stone;
  readonly row: number;
  readonly col: number;
  readonly commandId: string;
  readonly expectedRevision: number;
}

export interface GomokuOutcome {
  readonly status: GameStatus;
  readonly winner: Stone | null;
}

export interface GomokuPublicMove {
  readonly seq: number;
  readonly player: Stone;
  readonly row: number;
  readonly col: number;
}

export interface GomokuView {
  readonly schemaVersion: 1;
  readonly rulesetId: string;
  readonly boardSize: number;
  readonly board: readonly Cell[];
  readonly moves: readonly GomokuPublicMove[];
  readonly revision: number;
  readonly nextPlayer: Stone | null;
  readonly status: GameStatus;
  readonly winner: Stone | null;
}

export interface GomokuScoringEvidence {
  readonly source: "unverified_rules_engine";
  readonly gameId: "gomoku";
  readonly rulesetId: typeof GOMOKU_RULESET_ID;
  readonly outcome: "won" | "draw";
  readonly winner: Stone | null;
  readonly moveCount: number;
  readonly stateHash: string;
}

export const gomokuManifest: GameManifest = Object.freeze({
  gameId: "gomoku",
  gameVersion: "0.1.0-dev",
  rulesetId: GOMOKU_RULESET_ID,
  stateSchemaVersion: 1,
  playersMin: 2,
  playersMax: 2,
  renderer: "grid-2d",
  releaseStatus: "draft",
});

function isValidCoordinate(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < BOARD_SIZE;
}
function indexOfCell(row: number, col: number): number {
  return row * BOARD_SIZE + col;
}
function opponent(player: Stone): Stone {
  return player === "black" ? "white" : "black";
}
function reject(code: GameActionErrorCode): ActionValidation {
  return { ok: false, code };
}

export function createInitialState(seed: string): GomokuState {
  if (typeof seed !== "string" || seed.length === 0 || seed.length > 128) {
    throw new RangeError("A non-empty seed of at most 128 characters is required");
  }
  return {
    schemaVersion: 1,
    rulesetId: GOMOKU_RULESET_ID,
    seed,
    board: Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (): Cell => null),
    history: [],
    revision: 0,
    nextPlayer: "black",
    status: "active",
    winner: null,
  };
}

export function validateAction(
  state: GomokuState,
  action: PlaceStoneAction,
): ActionValidation {
  if (!action || action.type !== "place_stone") return reject("UNKNOWN_ACTION");
  if (typeof action.commandId !== "string" ||
      !/^[a-zA-Z0-9._:-]{1,80}$/.test(action.commandId)) {
    return reject("INVALID_COMMAND_ID");
  }
  if (state.history.some(move => move.commandId === action.commandId)) {
    return reject("DUPLICATE_COMMAND");
  }
  if (state.status !== "active") return reject("MATCH_FINISHED");
  if (!Number.isInteger(action.expectedRevision) ||
      action.expectedRevision !== state.revision) {
    return reject("STALE_REVISION");
  }
  if (action.player !== state.nextPlayer) return reject("NOT_YOUR_TURN");
  if (!isValidCoordinate(action.row) || !isValidCoordinate(action.col)) {
    return reject("OUT_OF_BOUNDS");
  }
  if (state.board[indexOfCell(action.row, action.col)] !== null) {
    return reject("CELL_OCCUPIED");
  }
  return { ok: true };
}

function countDirection(
  board: readonly Cell[], player: Stone, row: number, col: number,
  rowStep: number, colStep: number,
): number {
  let count = 0;
  for (let r = row + rowStep, c = col + colStep;
       isValidCoordinate(r) && isValidCoordinate(c);
       r += rowStep, c += colStep) {
    if (board[indexOfCell(r, c)] !== player) break;
    count += 1;
  }
  return count;
}

function wonOnLastMove(
  board: readonly Cell[], player: Stone, row: number, col: number,
): boolean {
  const axes: readonly (readonly [number, number])[] = [
    [1, 0], [0, 1], [1, 1], [1, -1],
  ];
  return axes.some(([dr, dc]) =>
    1 + countDirection(board, player, row, col, dr, dc)
      + countDirection(board, player, row, col, -dr, -dc) >= WIN_LENGTH,
  );
}

export function applyAction(
  state: GomokuState,
  action: PlaceStoneAction,
): GomokuState {
  assertAllowed(validateAction(state, action));
  const board = [...state.board];
  board[indexOfCell(action.row, action.col)] = action.player;
  const revision = state.revision + 1;
  const history = [...state.history, {
    seq: revision,
    player: action.player,
    row: action.row,
    col: action.col,
    commandId: action.commandId,
  }];
  const won = wonOnLastMove(board, action.player, action.row, action.col);
  const draw = !won && revision === BOARD_SIZE * BOARD_SIZE;
  return {
    ...state,
    board,
    history,
    revision,
    status: won ? "won" : draw ? "draw" : "active",
    winner: won ? action.player : null,
    nextPlayer: won || draw ? null : opponent(action.player),
  };
}

export function getPlayerView(
  state: GomokuState, viewer: string | null,
): GomokuView {
  // The viewer is a presentation hint only, not authenticated player identity.
  if (viewer !== null && typeof viewer !== "string") {
    throw new TypeError("Viewer must be a string or null");
  }
  // Gomoku has no hidden board pieces. Never expose internal command IDs here.
  return {
    schemaVersion: state.schemaVersion,
    rulesetId: state.rulesetId,
    boardSize: BOARD_SIZE,
    board: [...state.board],
    moves: state.history.map(({ seq, player, row, col }) => ({
      seq, player, row, col,
    })),
    revision: state.revision,
    nextPlayer: state.nextPlayer,
    status: state.status,
    winner: state.winner,
  };
}

export function getOutcome(state: GomokuState): GomokuOutcome {
  return { status: state.status, winner: state.winner };
}

