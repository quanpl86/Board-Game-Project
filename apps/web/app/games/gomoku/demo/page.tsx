import type { Metadata } from "next";
import GomokuLocalBoard from "./GomokuLocalBoard";
import "./gomoku.css";

export const metadata: Metadata = {
  title: "Gomoku · Chơi thử cục bộ | Board Game Universe",
  description: "Bản chơi thử Gomoku 15×15 dành cho hai người trên cùng thiết bị. Không đăng nhập, không lưu điểm.",
};

export default function GomokuDemoPage() {
  return (
    <div className="gomoku-page">
      <header className="gomoku-page-header">
        <div className="container gomoku-page-header-inner">
          <a className="brand" href="/" aria-label="Board Game Universe - Về trang chủ">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <span>KINGDRAGON<span className="brand-accent">HUB</span></span>
          </a>
          <a className="gomoku-back-link" href="/#games">← Về danh mục trò chơi</a>
        </div>
      </header>
      <main id="main-content" className="container">
        <GomokuLocalBoard />
      </main>
      <footer className="gomoku-page-footer">
        <div className="container">Board Game Universe · Bản chơi thử offline, không thu thập dữ liệu người dùng.</div>
      </footer>
    </div>
  );
}
