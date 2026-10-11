/**
 * Server / Node entry: pure Gomoku rules plus cryptographic replay hashing.
 * Browser UI must import @bgu/gomoku/client rather than this Node entry.
 */
import { createHash } from "node:crypto";
import type { GamePlugin } from "@bgu/game-sdk";
import {
  BOARD_SIZE, GOMOKU_RULESET_ID, createInitialState, applyAction,
  validateAction, getPlayerView, getOutcome, gomokuManifest,
  type GomokuState, type PlaceStoneAction,
  type GomokuView, type GomokuOutcome, type GomokuScoringEvidence,
} from "./core.js";
export * from "./core.js";

/**
 * Domain-state canonical hash. Reproducible, NOT server attestation/signature.
 * Explicit field order is pinned for this state-schema version.
 */
export function hashState(state: GomokuState): string {
  const canonical = JSON.stringify({
    schemaVersion: state.schemaVersion,
    rulesetId: state.rulesetId,
    seed: state.seed,
    board: state.board,
    history: state.history.map(m => [
      m.seq, m.player, m.row, m.col, m.commandId,
    ]),
    revision: state.revision,
    nextPlayer: state.nextPlayer,
    status: state.status,
    winner: state.winner,
  });
  return createHash("sha256").update(canonical, "utf8").digest("hex");
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

export function getScoringEvidence(
  state: GomokuState,
): GomokuScoringEvidence | null {
  if (state.status === "active") return null;
  return {
    source: "unverified_rules_engine",
    gameId: "gomoku",
    rulesetId: GOMOKU_RULESET_ID,
    outcome: state.status,
    winner: state.winner,
    moveCount: state.revision,
    stateHash: hashState(state),
  };
}

export class ReplayIntegrityError extends Error {
  constructor() {
    super("REPLAY_HASH_MISMATCH");
    this.name = "ReplayIntegrityError";
  }
}

/** Replay only version-pinned, already-authorized accepted commands. */
export function replayGomoku(
  seed: string, commands: readonly PlaceStoneAction[],
  expectedFinalHash?: string,
): GomokuState {
  let state = createInitialState(seed);
  for (const command of commands) {
    state = applyAction(state, command);
  }
  if (expectedFinalHash !== undefined && hashState(state) !== expectedFinalHash) {
    throw new ReplayIntegrityError();
  }
  return state;
}

export const gomokuPlugin: GamePlugin<
  GomokuState, PlaceStoneAction, GomokuView, GomokuOutcome, GomokuScoringEvidence
> = Object.freeze({
  manifest: gomokuManifest,
  createInitialState,
  validateAction,
  applyAction,
  getPlayerView,
  getOutcome,
  getScoringEvidence,
});
