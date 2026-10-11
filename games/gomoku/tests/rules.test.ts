import test from "node:test";
import assert from "node:assert/strict";
import { GameRuleError } from "@bgu/game-sdk";
import {
  BOARD_SIZE,
  applyAction,
  createInitialState,
  getOutcome,
  getPlayerView,
  getScoringEvidence,
  gomokuManifest,
  gomokuPlugin,
  hashState,
  replayGomoku,
  ReplayIntegrityError,
  validateAction,
  type GomokuState,
  type PlaceStoneAction,
  type Stone,
} from "../src/index.js";

function command(
  state: GomokuState,
  row: number,
  col: number,
  commandId = `cmd-${state.revision + 1}`,
): PlaceStoneAction {
  if (!state.nextPlayer) throw new Error("MATCH_ALREADY_ENDED");
  return {
    type: "place_stone", player: state.nextPlayer, row, col,
    expectedRevision: state.revision, commandId,
  };
}
function play(coordinates: readonly (readonly [number, number])[]): {
  state: GomokuState;
  actions: PlaceStoneAction[];
} {
  let state = createInitialState("synthetic-match-seed");
  const actions: PlaceStoneAction[] = [];
  for (const [row, col] of coordinates) {
    const move = command(state, row, col);
    actions.push(move);
    state = applyAction(state, move);
  }
  return { state, actions };
}
function expectInvalid(state: GomokuState, action: PlaceStoneAction, code: string) {
  const result = validateAction(state, action);
  assert.deepEqual(result, { ok: false, code });
  assert.throws(() => applyAction(state, action),
    (error: unknown) => error instanceof GameRuleError && error.code === code);
}

test("manifest is version-pinned, draft and accepts a deterministic initial seed", () => {
  assert.equal(gomokuManifest.releaseStatus, "draft");
  assert.equal(gomokuManifest.stateSchemaVersion, 1);
  assert.equal(gomokuManifest.playersMin, 2);
  const state = gomokuPlugin.createInitialState("demo");
  assert.equal(state.board.length, BOARD_SIZE * BOARD_SIZE);
  assert.equal(state.revision, 0);
  assert.equal(state.nextPlayer, "black");
  assert.equal(state.status, "active");
  assert.deepEqual(state, createInitialState("demo"));
  assert.throws(() => createInitialState(""), RangeError);
  assert.throws(() => createInitialState("x".repeat(129)), RangeError);
  assert.equal(getScoringEvidence(state), null);
});

test("legal move is immutable, revisioned and alternates turns", () => {
  const first = createInitialState("immutability");
  const before = hashState(first);
  const move = command(first, 7, 7);
  assert.deepEqual(validateAction(first, move), { ok: true });
  const second = applyAction(first, move);
  assert.equal(second.board[7 * 15 + 7], "black");
  assert.equal(second.nextPlayer, "white");
  assert.equal(second.revision, 1);
  assert.equal(second.history[0]?.seq, 1);
  assert.equal(first.board[7 * 15 + 7], null);
  assert.equal(first.revision, 0);
  assert.equal(hashState(first), before);
  const third = applyAction(second, command(second, 7, 8));
  assert.equal(third.nextPlayer, "black");
  assert.equal(third.revision, 2);
});

test("rejections: out-of-bounds, floating/NaN, occupied and invalid action", () => {
  const state = createInitialState("invalid");
  for (const [row, col] of [[-1, 1], [15, 4], [0, 15], [0.5, 2], [NaN, 0]]) {
    expectInvalid(state, command(state, row, col), "OUT_OF_BOUNDS");
  }
  expectInvalid(state, { ...command(state, 0, 0), type: "unknown" } as unknown as PlaceStoneAction,
    "UNKNOWN_ACTION");
  expectInvalid(state, { ...command(state, 0, 0), commandId: "" }, "INVALID_COMMAND_ID");
  expectInvalid(state, { ...command(state, 0, 0), commandId: "not allowed" }, "INVALID_COMMAND_ID");
  const next = applyAction(state, command(state, 0, 0));
  expectInvalid(next, command(next, 0, 0), "CELL_OCCUPIED");
});

test("rejections: turn spoofing, stale revision and duplicate command ID", () => {
  const state = createInitialState("turns");
  expectInvalid(state, { ...command(state, 0, 0), player: "white" }, "NOT_YOUR_TURN");
  expectInvalid(state, { ...command(state, 0, 0), expectedRevision: 1 }, "STALE_REVISION");
  const move = command(state, 0, 0, "stable-id");
  const next = applyAction(state, move);
  expectInvalid(next, { ...command(next, 0, 1), commandId: "stable-id" },
    "DUPLICATE_COMMAND");
  expectInvalid(next, { ...command(next, 0, 1), expectedRevision: 0 },
    "STALE_REVISION");
});

test("black completes a horizontal five, including a one-cell gap", () => {
  const { state } = play([
    [7, 3], [0, 0], [7, 4], [0, 2], [7, 6],
    [0, 4], [7, 7], [0, 6], [7, 5],
  ]);
  assert.deepEqual(getOutcome(state), { status: "won", winner: "black" });
  assert.equal(state.revision, 9);
  assert.equal(state.nextPlayer, null);
  assert.equal(getScoringEvidence(state)?.winner, "black");
  expectInvalid(state, {
    type: "place_stone", player: "white", row: 3, col: 3,
    expectedRevision: 9, commandId: "after-end",
  }, "MATCH_FINISHED");
});

test("white can win vertically on move 10", () => {
  const { state } = play([
    [14, 0], [5, 5], [14, 2], [6, 5], [14, 4],
    [7, 5], [14, 6], [8, 5], [14, 8], [9, 5],
  ]);
  assert.equal(state.status, "won");
  assert.equal(state.winner, "white");
  assert.equal(state.revision, 10);
});

test("both diagonal axes detect a five in a row", () => {
  for (const line of [
    [[2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
    [[2, 6], [3, 5], [4, 4], [5, 3], [6, 2]],
  ]) {
    const sequence: Array<[number, number]> = [];
    for (const [i, position] of line.entries()) {
      sequence.push(position as [number, number]);
      if (i !== line.length - 1) sequence.push([14, i * 2]);
    }
    const { state } = play(sequence);
    assert.equal(state.status, "won");
    assert.equal(state.winner, "black");
  }
});

test("same seed and accepted action sequence reproduce identical hash and board", () => {
  const sequence: Array<[number, number]> = [
    [5, 5], [5, 6], [6, 5], [6, 6], [7, 5], [7, 6],
  ];
  const { state, actions } = play(sequence);
  const reconstructed = replayGomoku("synthetic-match-seed", actions, hashState(state));
  assert.deepEqual(reconstructed, state);
  assert.equal(hashState(reconstructed), hashState(state));
  assert.match(hashState(state), /^[a-f0-9]{64}$/);
  const altered = actions.map(x => ({ ...x }));
  altered[0] = { ...altered[0], row: 1 };
  assert.throws(() => replayGomoku("synthetic-match-seed", altered, hashState(state)),
    (error: unknown) => error instanceof ReplayIntegrityError);
  assert.throws(() => replayGomoku("synthetic-match-seed", [...actions, actions[0]]),
    (error: unknown) => error instanceof GameRuleError);
});

test("public views redact command IDs and do not allow board mutation", () => {
  const { state } = play([[7, 7], [7, 8]]);
  const view = getPlayerView(state, null);
  assert.equal(view.boardSize, 15);
  assert.equal(view.revision, 2);
  assert.equal(view.moves.length, 2);
  assert.equal("commandId" in view.moves[0]!, false);
  assert.deepEqual(view, getPlayerView(state, "guest-viewer"));
  (view.board as Array<Stone | null>)[0] = "white";
  assert.equal(state.board[0], null);
  assert.equal(view.winner, null);
  assert.equal(getScoringEvidence(state), null);
});

test("a completely filled, five-free board ends as a draw without a payout", () => {
  // Deterministic 15x15 fixture: 113 B / 112 W, no 5 in any axis.
  const rows = [
    "WWWWBWWBBBWBBWB",
    "WBBWBBWBBBBWWWW",
    "BWBWWWWBWBWWBWW",
    "WBWBBWBWBWBBBBW",
    "WWBBWWBWBBBWBWB",
    "BBWBWWBBBBWWWWB",
    "WWBWWBBWWBWBBWW",
    "WWBWBWWWBWWWBBW",
    "BWWWWBBWBBBBWBW",
    "BBBBWWWBBWBWBWB",
    "WBBBWBWBWWWWBBB",
    "BBWBBWBBWWWWBWW",
    "BWBBWWBWBBBWBWB",
    "WBWWWBBWBWWBWBW",
    "WWBBBBWBBBWBBBW",
  ];
  assert.equal(rows.length, 15);
  assert.ok(rows.every(row => row.length === 15));
  const black: Array<[number, number]> = [];
  const white: Array<[number, number]> = [];
  rows.forEach((row, r) => [...row].forEach((stone, c) =>
    (stone === "B" ? black : white).push([r, c])));
  assert.equal(black.length, 113);
  assert.equal(white.length, 112);
  let state = createInitialState("draw-fixture");
  for (let i = 0; i < 113; i++) {
    const b = black[i]!;
    state = applyAction(state, command(state, b[0], b[1]));
    if (i < 112) {
      const w = white[i]!;
      state = applyAction(state, command(state, w[0], w[1]));
    }
  }
  assert.equal(state.revision, 225);
  assert.deepEqual(getOutcome(state), { status: "draw", winner: null });
  const evidence = getScoringEvidence(state);
  assert.equal(evidence?.outcome, "draw");
  assert.equal(evidence?.source, "unverified_rules_engine");
  assert.equal(evidence?.winner, null);
});
