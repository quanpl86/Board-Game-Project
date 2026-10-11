/**
 * Board Game Universe — pure versioned game plugin contract (DEV candidate).
 *
 * This module defines in-process rules only. An authoritative backend must
 * authenticate the caller, persist accepted commands, and sign/finalize results.
 */
export type GameActionErrorCode =
  | "UNKNOWN_ACTION"
  | "INVALID_COMMAND_ID"
  | "STALE_REVISION"
  | "DUPLICATE_COMMAND"
  | "MATCH_FINISHED"
  | "NOT_YOUR_TURN"
  | "OUT_OF_BOUNDS"
  | "CELL_OCCUPIED";

export type ActionValidation =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: GameActionErrorCode };

export interface GameManifest {
  /** Stable catalog key, not a game display name. */
  readonly gameId: string;
  /** Immutable logical ruleset identifier; version bump for rule changes. */
  readonly rulesetId: string;
  readonly gameVersion: string;
  readonly stateSchemaVersion: number;
  readonly playersMin: number;
  readonly playersMax: number;
  readonly renderer: "grid-2d" | "scene-3d" | "custom";
  /** Draft manifests are never treated as a published game version. */
  readonly releaseStatus: "draft" | "published";
}

export interface GamePlugin<State, Action, View, Outcome, Evidence> {
  readonly manifest: GameManifest;
  /** Pure and deterministic. Never trust a browser-selected seed for scored games. */
  createInitialState(seed: string): State;
  /** The authoritative service validates actor identity BEFORE calling this. */
  validateAction(state: State, action: Action): ActionValidation;
  /** Pure immutable reducer; throws if action is illegal. */
  applyAction(state: State, action: Action): State;
  /** Strip any game-specific secret before leaving server boundary. */
  getPlayerView(state: State, viewer: string | null): View;
  getOutcome(state: State): Outcome;
  /** Derived *candidate*, not a verified, signed or persisted score. */
  getScoringEvidence(state: State): Evidence | null;
}

export class GameRuleError extends Error {
  constructor(readonly code: GameActionErrorCode) {
    super(code);
    this.name = "GameRuleError";
  }
}

export function assertAllowed(result: ActionValidation): void {
  if (!result.ok) throw new GameRuleError(result.code);
}
