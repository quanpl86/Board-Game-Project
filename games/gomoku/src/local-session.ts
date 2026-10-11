/**
 * Synthetic same-device demo controller. No identity, storage, network, SSO or
 * server-verified result. All data is lost when the page is refreshed.
 */
import {
  applyAction,
  createInitialState,
  type GomokuMove,
  type GomokuState,
  type PlaceStoneAction,
  validateAction,
} from "./core.js";

export interface LocalGomokuSession {
  readonly match: GomokuState;
  /** null = play; a value 0..revision = inspect historical snapshot. */
  readonly replayCursor: number | null;
  readonly errorCode: string | null;
}

export type LocalSessionAction =
  | { readonly type: "place"; readonly row: number; readonly col: number }
  | { readonly type: "undo" }
  | { readonly type: "restart" }
  | { readonly type: "replay_start" }
  | { readonly type: "replay_seek"; readonly cursor: number }
  | { readonly type: "replay_stop" };

const SEED = "gomoku-local-preview-v1";

export function createLocalGomokuSession(): LocalGomokuSession {
  return {
    match: createInitialState(SEED),
    replayCursor: null,
    errorCode: null,
  };
}

/** Replay trusted engine-generated moves, checking continuity at every step. */
export function reconstructLocalHistory(
  source: GomokuState,
  through: number,
): GomokuState {
  if (!Number.isInteger(through) || through < 0 || through > source.history.length) {
    throw new RangeError("REPLAY_CURSOR_OUT_OF_BOUNDS");
  }
  let state = createInitialState(source.seed);
  for (const move of source.history.slice(0, through)) {
    const prior: GomokuMove = move;
    if (prior.seq !== state.revision + 1) {
      throw new Error("REPLAY_SEQUENCE_MISMATCH");
    }
    const action: PlaceStoneAction = {
      type: "place_stone",
      row: prior.row,
      col: prior.col,
      player: prior.player,
      commandId: prior.commandId,
      expectedRevision: state.revision,
    };
    state = applyAction(state, action);
  }
  return state;
}

export function visibleLocalGomokuState(session: LocalGomokuSession): GomokuState {
  if (session.replayCursor === null) return session.match;
  return reconstructLocalHistory(session.match, session.replayCursor);
}

export function reduceLocalGomokuSession(
  session: LocalGomokuSession,
  action: LocalSessionAction,
): LocalGomokuSession {
  switch (action.type) {
    case "restart":
      return createLocalGomokuSession();
    case "replay_start":
      return session.match.revision === 0
        ? { ...session, errorCode: "NO_MOVES_TO_REPLAY" }
        : { ...session, replayCursor: 0, errorCode: null };
    case "replay_stop":
      return { ...session, replayCursor: null, errorCode: null };
    case "replay_seek":
      if (session.replayCursor === null) {
        return { ...session, errorCode: "REPLAY_NOT_ACTIVE" };
      }
      if (!Number.isInteger(action.cursor) ||
          action.cursor < 0 || action.cursor > session.match.revision) {
        return { ...session, errorCode: "REPLAY_CURSOR_OUT_OF_BOUNDS" };
      }
      return { ...session, replayCursor: action.cursor, errorCode: null };
    case "undo":
      if (session.replayCursor !== null) {
        return { ...session, errorCode: "REPLAY_READ_ONLY" };
      }
      if (session.match.revision === 0) {
        return { ...session, errorCode: "NOTHING_TO_UNDO" };
      }
      return {
        match: reconstructLocalHistory(session.match, session.match.revision - 1),
        replayCursor: null,
        errorCode: null,
      };
    case "place": {
      if (session.replayCursor !== null) {
        return { ...session, errorCode: "REPLAY_READ_ONLY" };
      }
      const state = session.match;
      // A side claim is synthetic; it is NOT an authenticated player.
      const move: PlaceStoneAction = {
        type: "place_stone",
        player: state.nextPlayer ?? "black",
        row: action.row,
        col: action.col,
        commandId: `local-${state.revision + 1}`,
        expectedRevision: state.revision,
      };
      const result = validateAction(state, move);
      if (!result.ok) return { ...session, errorCode: result.code };
      return { match: applyAction(state, move), replayCursor: null, errorCode: null };
    }
    default: {
      const never: never = action;
      return never;
    }
  }
}
