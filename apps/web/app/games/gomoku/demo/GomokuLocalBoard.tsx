"use client";

import { useReducer, useRef, useState, type KeyboardEvent } from "react";
import {
  BOARD_SIZE,
  createLocalGomokuSession,
  getOutcome,
  getPlayerView,
  reduceLocalGomokuSession,
  visibleLocalGomokuState,
  type Stone,
} from "@bgu/gomoku/client";

const stoneName = (stone: Stone | null) =>
  stone === "black" ? "Đen" : stone === "white" ? "Trắng" : "Trống";

const feedback: Readonly<Record<string, string>> = {
  UNKNOWN_ACTION: "Hành động không được hỗ trợ.",
  INVALID_COMMAND_ID: "Mã nước đi không hợp lệ.",
  STALE_REVISION: "Trạng thái bàn cờ đã thay đổi. Vui lòng thử lại.",
  DUPLICATE_COMMAND: "Nước đi này đã được xử lý.",
  MATCH_FINISHED: "Ván đấu đã kết thúc. Chọn Chơi lại để bắt đầu ván mới.",
  NOT_YOUR_TURN: "Chưa đến lượt chơi.",
  OUT_OF_BOUNDS: "Ô chọn nằm ngoài bàn cờ.",
  CELL_OCCUPIED: "Ô này đã có quân. Hãy chọn ô khác.",
  REPLAY_READ_ONLY: "Hãy thoát chế độ xem lại trước khi tiếp tục chơi.",
  REPLAY_NOT_ACTIVE: "Chưa bật chế độ xem lại.",
  REPLAY_CURSOR_OUT_OF_BOUNDS: "Vị trí xem lại không hợp lệ.",
  NO_MOVES_TO_REPLAY: "Cần có ít nhất một nước đi để xem lại.",
  NOTHING_TO_UNDO: "Không có nước đi nào để hoàn tác.",
};

function moveName(player: Stone): string {
  return player === "black" ? "Đen" : "Trắng";
}

export default function GomokuLocalBoard() {
  const [session, dispatch] = useReducer(
    reduceLocalGomokuSession, undefined, createLocalGomokuSession,
  );
  const [focusIndex, setFocusIndex] = useState(7 * BOARD_SIZE + 7);
  const cellButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const viewedState = visibleLocalGomokuState(session);
  const view = getPlayerView(viewedState, null);
  const liveOutcome = getOutcome(session.match);
  const inReplay = session.replayCursor !== null;
  const lastMove = viewedState.history.at(-1);
  const turnMessage =
    inReplay
      ? `Đang xem nước ${session.replayCursor} / ${session.match.revision}.`
      : liveOutcome.status === "won"
        ? `Quân ${stoneName(liveOutcome.winner)} đã thắng! ${session.match.revision} nước đi.`
        : liveOutcome.status === "draw"
          ? "Ván đấu hòa: bàn cờ đã đầy."
          : `Đến lượt quân ${stoneName(session.match.nextPlayer)}.`;

  const helpText = inReplay
    ? "Chế độ xem lại chỉ đọc. Thoát xem lại để tiếp tục đánh cờ."
    : "Hai người thay phiên trên cùng thiết bị. Chọn ô trống để đặt quân.";

  function focusCell(row: number, col: number) {
    const index = row * BOARD_SIZE + col;
    setFocusIndex(index);
    cellButtons.current[index]?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    row: number,
    col: number,
  ) {
    let nextRow = row;
    let nextCol = col;
    switch (event.key) {
      case "ArrowLeft": nextCol = Math.max(0, col - 1); break;
      case "ArrowRight": nextCol = Math.min(BOARD_SIZE - 1, col + 1); break;
      case "ArrowUp": nextRow = Math.max(0, row - 1); break;
      case "ArrowDown": nextRow = Math.min(BOARD_SIZE - 1, row + 1); break;
      case "Home": nextCol = 0; break;
      case "End": nextCol = BOARD_SIZE - 1; break;
      default: return;
    }
    event.preventDefault();
    focusCell(nextRow, nextCol);
  }

  return (
    <section className="gomoku-demo" aria-labelledby="gomoku-game-title">
      <header className="gomoku-demo-heading">
        <div>
          <div className="eyebrow"><span className="orange-dot" /> GAME-04 · LOCAL PREVIEW</div>
          <h1 id="gomoku-game-title">Cờ caro <span>Gomoku</span></h1>
          <p>Luật tự do trên bàn cờ 15 × 15: xếp 5 quân trở lên thành một hàng để chiến thắng.</p>
        </div>
        <div className="gomoku-preview-tag" role="note">
          <strong>Chơi thử cục bộ</strong>
          <span>Không đăng nhập · Không lưu điểm · Không trực tuyến</span>
        </div>
      </header>

      <div className="gomoku-playground">
        <div className="gomoku-board-panel">
          <div className="gomoku-toolbar">
            <div className="gomoku-turn-state" role="status" aria-live="polite" aria-atomic="true">
              <span
                aria-hidden="true"
                className={`gomoku-turn-symbol ${!inReplay && session.match.nextPlayer === "black" ? "gomoku-symbol-black" : !inReplay && session.match.nextPlayer === "white" ? "gomoku-symbol-white" : "gomoku-symbol-neutral"}`}
              />
              <strong>{turnMessage}</strong>
            </div>
            <span className="gomoku-revision">Số nước: {session.match.revision}</span>
          </div>
          <p className="gomoku-board-instruction">{helpText} Dùng các phím mũi tên để di chuyển, Enter hoặc Space để đánh.</p>

          <div className="gomoku-board-scroll" role="region" aria-label="Khu vực bàn cờ có thể cuộn ngang" tabIndex={0}>
            <div className="gomoku-board" role="grid" aria-label="Bàn cờ Gomoku 15 hàng, 15 cột" aria-rowcount={BOARD_SIZE} aria-colcount={BOARD_SIZE}>
              {Array.from({ length: BOARD_SIZE }, (_, row) => (
                <div className="gomoku-board-row" role="row" key={row} aria-rowindex={row + 1}>
                  {Array.from({ length: BOARD_SIZE }, (_, col) => {
                    const index = row * BOARD_SIZE + col;
                    const value = view.board[index] ?? null;
                    const isLast = lastMove?.row === row && lastMove.col === col;
                    const blocked = inReplay || view.status !== "active" || value !== null;
                    const label = `Hàng ${row + 1}, cột ${col + 1}: ${stoneName(value)}${isLast ? ", nước vừa đi" : ""}${blocked ? ", không thể đánh" : ", có thể đánh"}`;
                    return (
                      <div
                        role="gridcell"
                        aria-colindex={col + 1}
                        aria-selected={isLast}
                        className={`gomoku-gridcell${isLast ? " gomoku-gridcell-last" : ""}`}
                        key={col}
                      >
                        <button
                          type="button"
                          ref={node => { cellButtons.current[index] = node; }}
                          className="gomoku-cell"
                          aria-label={label}
                          aria-disabled={blocked}
                          tabIndex={focusIndex === index ? 0 : -1}
                          onFocus={() => setFocusIndex(index)}
                          onKeyDown={event => handleKeyDown(event, row, col)}
                          onClick={() => {
                            setFocusIndex(index);
                            dispatch({ type: "place", row, col });
                          }}
                        >
                          {value !== null && (
                            <span className={`gomoku-stone gomoku-stone-${value}`} aria-hidden="true" />
                          )}
                          {isLast && <span className="gomoku-last-marker" aria-hidden="true" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="gomoku-scroll-hint">Màn hình nhỏ: vuốt hoặc cuộn ngang để xem toàn bộ bàn cờ.</p>
          {session.errorCode && (
            <p role="alert" className="gomoku-error">{feedback[session.errorCode] ?? "Không thể thực hiện thao tác này."}</p>
          )}
          <div className="gomoku-controls">
            <button type="button" className="button button-primary" onClick={() => {
              dispatch({ type: "restart" });
              setFocusIndex(7 * BOARD_SIZE + 7);
            }}>Chơi lại từ đầu</button>
            <button type="button" className="button button-outline"
              disabled={inReplay || session.match.revision === 0}
              onClick={() => dispatch({ type: "undo" })}
            >Hoàn tác nước cuối</button>
            {!inReplay
              ? <button type="button" className="button button-outline"
                  disabled={session.match.revision === 0}
                  onClick={() => dispatch({ type: "replay_start" })}
                >Xem lại ván đấu</button>
              : <button type="button" className="button button-outline"
                  onClick={() => dispatch({ type: "replay_stop" })}
                >Thoát xem lại</button>}
          </div>

          {inReplay && (
            <section className="gomoku-replay" aria-label="Điều khiển xem lại">
              <div className="gomoku-replay-heading">
                <strong>Xem lại nước đi</strong>
                <span>{session.replayCursor} / {session.match.revision}</span>
              </div>
              <label htmlFor="gomoku-replay-cursor" className="gomoku-slider-label">Chọn vị trí trong ván đấu</label>
              <input
                id="gomoku-replay-cursor"
                type="range"
                min={0}
                max={session.match.revision}
                value={session.replayCursor ?? 0}
                onChange={event => dispatch({ type: "replay_seek", cursor: Number(event.target.value) })}
              />
              <div className="gomoku-replay-controls">
                <button type="button" className="button button-outline"
                  disabled={session.replayCursor === 0}
                  onClick={() => dispatch({ type: "replay_seek", cursor: (session.replayCursor ?? 0) - 1 })}
                >← Nước trước</button>
                <button type="button" className="button button-outline"
                  disabled={session.replayCursor === session.match.revision}
                  onClick={() => dispatch({ type: "replay_seek", cursor: (session.replayCursor ?? 0) + 1 })}
                >Nước sau →</button>
              </div>
            </section>
          )}
        </div>

        <aside className="gomoku-sidebar" aria-label="Thông tin ván đấu">
          <section className="gomoku-info-card">
            <h2>Người chơi</h2>
            <div className={`gomoku-player${!inReplay && session.match.nextPlayer === "black" ? " gomoku-player-active" : ""}`}>
              <span className="gomoku-player-stone gomoku-stone-black" aria-hidden="true" />
              <div><strong>Quân Đen</strong><small>Đi trước · Người chơi 1</small></div>
              {!inReplay && session.match.nextPlayer === "black" && <span className="gomoku-active-text">Đến lượt</span>}
            </div>
            <div className={`gomoku-player${!inReplay && session.match.nextPlayer === "white" ? " gomoku-player-active" : ""}`}>
              <span className="gomoku-player-stone gomoku-stone-white" aria-hidden="true" />
              <div><strong>Quân Trắng</strong><small>Đi sau · Người chơi 2</small></div>
              {!inReplay && session.match.nextPlayer === "white" && <span className="gomoku-active-text">Đến lượt</span>}
            </div>
            <p className="gomoku-local-note">Chế độ hai người cùng thiết bị, không kết nối máy chủ.</p>
          </section>
          <section className="gomoku-info-card gomoku-history-card">
            <h2>Lịch sử nước đi</h2>
            {view.moves.length === 0
              ? <p className="gomoku-empty-history">Chưa có nước đi nào trong phần đang xem.</p>
              : <ol className="gomoku-history-list">
                  {view.moves.map(move => (
                    <li key={move.seq}>
                      <span>{move.seq}.</span>
                      <strong>{moveName(move.player)}</strong>
                      <span>H{move.row + 1} · C{move.col + 1}</span>
                    </li>
                  ))}
                </ol>}
          </section>
          <section className="gomoku-info-card gomoku-rules-card">
            <h2>Luật chơi nhanh</h2>
            <p>Đen bắt đầu. Mỗi lượt chọn một ô chưa có quân. Khi nối được từ 5 quân cùng màu liên tiếp theo hàng ngang, dọc hoặc chéo, người đó thắng.</p>
            <p>Đây là Gomoku freestyle, không áp dụng các nước cấm Renju. Bản demo không tính xếp hạng hay phần thưởng.</p>
          </section>
        </aside>
      </div>
    </section>
  );
}
