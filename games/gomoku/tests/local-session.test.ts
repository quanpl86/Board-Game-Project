import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  BOARD_SIZE,
  createLocalGomokuSession,
  getPlayerView,
  reconstructLocalHistory,
  reduceLocalGomokuSession,
  visibleLocalGomokuState,
  type LocalGomokuSession,
} from "../src/client.js";

const step = (session: LocalGomokuSession, row: number, col: number) =>
  reduceLocalGomokuSession(session, { type: "place", row, col });

test("browser-safe entry and controller never reference Node crypto", () => {
  for (const relative of ["../src/client.ts", "../src/core.ts", "../src/local-session.ts"]) {
    const source = readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
    assert.equal(source.includes("node:crypto"), false, relative);
    assert.equal(source.includes('from "./index.js"'), false, relative);
  }
  const session = createLocalGomokuSession();
  assert.equal(session.match.board.length, BOARD_SIZE * BOARD_SIZE);
  assert.equal(session.replayCursor, null);
});

test("two local players alternate with one revision per accepted click", () => {
  const initial = createLocalGomokuSession();
  const second = step(initial, 7, 7);
  assert.equal(initial.match.revision, 0);
  assert.equal(second.match.revision, 1);
  assert.equal(second.match.board[7 * 15 + 7], "black");
  assert.equal(second.match.nextPlayer, "white");
  const third = step(second, 7, 8);
  assert.equal(third.match.revision, 2);
  assert.equal(third.match.board[7 * 15 + 8], "white");
  assert.equal(third.match.nextPlayer, "black");
  assert.equal(third.errorCode, null);
});

test("invalid click cannot mutate or advance local match", () => {
  const first = step(createLocalGomokuSession(), 0, 0);
  const invalid = step(first, 0, 0);
  assert.equal(invalid.errorCode, "CELL_OCCUPIED");
  assert.strictEqual(invalid.match, first.match);
  assert.equal(invalid.match.revision, 1);
  const offBoard = step(first, 20, 2);
  assert.equal(offBoard.errorCode, "OUT_OF_BOUNDS");
  assert.strictEqual(offBoard.match, first.match);
});

test("undo reconstructs accepted prefix without mutating earlier state", () => {
  const first = step(createLocalGomokuSession(), 7, 7);
  const second = step(first, 6, 6);
  const undone = reduceLocalGomokuSession(second, { type: "undo" });
  assert.equal(second.match.revision, 2);
  assert.equal(undone.match.revision, 1);
  assert.equal(undone.match.board[6 * 15 + 6], null);
  assert.equal(undone.match.board[7 * 15 + 7], "black");
  assert.equal(undone.match.nextPlayer, "white");
  const replaySameCell = step(undone, 6, 6);
  assert.equal(replaySameCell.errorCode, null);
  assert.deepEqual(replaySameCell.match, second.match);
});

test("cannot undo an empty game; restart clears history and replay state", () => {
  const empty = createLocalGomokuSession();
  const undone = reduceLocalGomokuSession(empty, { type: "undo" });
  assert.equal(undone.errorCode, "NOTHING_TO_UNDO");
  assert.strictEqual(undone.match, empty.match);
  const one = step(undone, 4, 4);
  const replay = reduceLocalGomokuSession(one, { type: "replay_start" });
  const reset = reduceLocalGomokuSession(replay, { type: "restart" });
  assert.deepEqual(reset, createLocalGomokuSession());
});

test("replay navigates each prefix with read-only board, history and result", () => {
  let session = createLocalGomokuSession();
  for (const [row, col] of [[5, 5], [0, 0], [5, 6], [0, 1]] as const) {
    session = step(session, row, col);
  }
  const live = session.match;
  session = reduceLocalGomokuSession(session, { type: "replay_start" });
  assert.equal(session.replayCursor, 0);
  assert.equal(visibleLocalGomokuState(session).revision, 0);
  session = reduceLocalGomokuSession(session, { type: "replay_seek", cursor: 3 });
  const frame = visibleLocalGomokuState(session);
  assert.equal(frame.revision, 3);
  assert.equal(frame.board[5 * 15 + 6], "black");
  assert.equal(frame.board[1], null);
  assert.equal(getPlayerView(frame, null).moves.length, 3);
  const blocked = step(session, 4, 4);
  assert.equal(blocked.errorCode, "REPLAY_READ_ONLY");
  assert.strictEqual(blocked.match, live);
  const stop = reduceLocalGomokuSession(blocked, { type: "replay_stop" });
  assert.equal(stop.replayCursor, null);
  assert.strictEqual(visibleLocalGomokuState(stop), live);
  const continued = step(stop, 5, 7);
  assert.equal(continued.match.revision, 5);
});

test("replay rejects cursor outside accepted move range or missing replay", () => {
  const empty = createLocalGomokuSession();
  const missing = reduceLocalGomokuSession(empty, { type: "replay_start" });
  assert.equal(missing.errorCode, "NO_MOVES_TO_REPLAY");
  const notActive = reduceLocalGomokuSession(empty, { type: "replay_seek", cursor: 0 });
  assert.equal(notActive.errorCode, "REPLAY_NOT_ACTIVE");
  const one = step(empty, 7, 7);
  const replay = reduceLocalGomokuSession(one, { type: "replay_start" });
  for (const cursor of [-1, 2, NaN, 0.5]) {
    const bad = reduceLocalGomokuSession(replay, { type: "replay_seek", cursor });
    assert.equal(bad.errorCode, "REPLAY_CURSOR_OUT_OF_BOUNDS");
    assert.equal(bad.replayCursor, 0);
  }
  assert.throws(() => reconstructLocalHistory(one.match, 2), RangeError);
});

test("undoing a five-in-row restores an active turn without spoofed score", () => {
  let session = createLocalGomokuSession();
  for (const [row, col] of [
    [7, 3], [0, 0], [7, 4], [0, 2], [7, 5], [0, 4], [7, 6], [0, 6], [7, 7],
  ] as const) {
    session = step(session, row, col);
  }
  assert.equal(session.match.winner, "black");
  assert.equal(session.match.status, "won");
  const after = step(session, 8, 8);
  assert.equal(after.errorCode, "MATCH_FINISHED");
  assert.equal(after.match.revision, 9);
  const undone = reduceLocalGomokuSession(session, { type: "undo" });
  assert.equal(undone.match.status, "active");
  assert.equal(undone.match.nextPlayer, "black");
  assert.equal(undone.match.winner, null);
  assert.equal(undone.match.revision, 8);
});

test("malformed historical sequence is denied during reconstruction", () => {
  const one = step(createLocalGomokuSession(), 0, 0);
  const forged = {
    ...one.match,
    history: [{ ...one.match.history[0]!, seq: 7 }],
  };
  assert.throws(() => reconstructLocalHistory(forged, 1), /REPLAY_SEQUENCE_MISMATCH/);
});
