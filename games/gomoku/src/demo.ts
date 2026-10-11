/** Local-only deterministic example. No users, identity, DB or game room. */
import {
  applyAction, createInitialState, getOutcome, getPlayerView,
  getScoringEvidence, hashState, replayGomoku, type PlaceStoneAction,
} from "./index.js";

const coordinates: Array<[number, number]> = [
  [7, 3], [0, 0], [7, 4], [0, 2], [7, 6],
  [0, 4], [7, 7], [0, 6], [7, 5],
];
let state = createInitialState("local-synthetic-gomoku");
const accepted: PlaceStoneAction[] = [];
for (const [row, col] of coordinates) {
  if (!state.nextPlayer) throw new Error("Unexpected terminal board");
  const move: PlaceStoneAction = {
    type: "place_stone",
    player: state.nextPlayer, row, col,
    expectedRevision: state.revision,
    commandId: `demo-${state.revision + 1}`,
  };
  state = applyAction(state, move);
  accepted.push(move);
}
const replay = replayGomoku("local-synthetic-gomoku", accepted, hashState(state));
const board = getPlayerView(replay, null).board;
for (let row = 0; row < 15; row++) {
  const line = board.slice(row * 15, (row + 1) * 15)
    .map(stone => stone === "black" ? "X" : stone === "white" ? "O" : ".")
    .join(" ");
  process.stdout.write(line + "\n");
}
console.log(JSON.stringify({
  rulesetId: state.rulesetId,
  outcome: getOutcome(state),
  revision: state.revision,
  deterministicReplay: hashState(state) === hashState(replay),
  candidateEvidence: getScoringEvidence(state),
}, null, 2));
console.log("DEV ONLY — no authorized identity, signed score, room or storage.");
