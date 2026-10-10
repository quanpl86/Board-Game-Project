import { sampleGames } from "@bgu/contracts";
export default function Home() {
  return <>
    <header className="site-header"><div className="container header-inner">
      <a className="brand" href="/" aria-label="Board Game Universe - Trang chủ"><span className="brand-mark" aria-hidden="true">✦</span><span>KINGDRAGON<span className="brand-accent">HUB</span></span></a>
      <nav className="main-nav" aria-label="Điều hướng chính"><a href="#games">Trò chơi</a><a href="#foundation">Nền tảng</a></nav>
      <span className="preview-pill" role="status">Foundation Alpha · Demo</span>
    </div></header>
    <main id="main-content">
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="orange-dot"/> PLAY · LEARN · CREATE</div>
          <h1>KHÁM PHÁ <span>THẾ GIỚI BOARD GAME</span></h1>
          <p>Nơi trò chơi, tư duy và sáng tạo gặp nhau. Đây là bản giao diện thử nghiệm theo định hướng KingDragonHub — chưa có đăng nhập hoặc trận đấu trực tuyến.</p>
          <div className="hero-actions"><a className="button button-primary" href="#games">Khám phá danh mục</a><a className="button button-outline" href="#foundation">Xem nền tảng</a></div>
        </div>
        <div className="hero-graphic" aria-hidden="true"><span className="hero-orbit">♟</span><span className="hero-orbit-small">◆</span></div>
      </section>
      <section className="games-section" id="games"><div className="container">
        <div className="eyebrow"><span className="orange-dot"/> GAME CATALOG · DEMO</div>
        <h2>TRÒ CHƠI <span className="accent">SẮP CÓ</span></h2>
        <p className="section-desc">Danh mục mẫu để thử giao diện và hợp đồng dữ liệu. Chưa có trò chơi nào được phát hành.</p>
        <div className="game-grid">{sampleGames.map((game,index) =>
          <article className="game-card" key={game.id}>
            <div className="game-icon" aria-hidden="true">{["▦","♟","◆"][index]}</div>
            <div className="tag">{game.genre}</div>
            <h3>{game.name}</h3><p>{game.description}</p>
            <div className="card-footer"><span>{game.playersMin}–{game.playersMax} người chơi</span><span className="coming-soon">Đang phát triển</span></div>
          </article>)}</div>
      </div></section>
      <section id="foundation" className="foundation container"><div className="eyebrow"><span className="orange-dot"/> FOUNDATION PHASE</div>
        <h2>CHẤT LƯỢNG <span className="accent">NGAY TỪ ĐẦU</span></h2>
        <div className="foundation-grid">
          <div><h3>Thiết kế nhất quán</h3><p>Giao diện theo ngôn ngữ KingDragonHub. Các token chưa đối chiếu CSS gốc còn tạm thời.</p></div>
          <div><h3>Game đa thể loại</h3><p>Game Registry sẽ hỗ trợ game 2D, 3D và giáo dục. Game Server và gameplay chưa triển khai.</p></div>
          <div><h3>AI có kiểm soát</h3><p>Agent có role, skill và quality gates. MCP Gateway chưa được phép truy cập các công cụ.</p></div>
        </div>
      </section>
    </main><footer className="footer"><div className="container">Board Game Universe — Foundation Preview · Không thu thập dữ liệu người dùng</div></footer>
  </>;
}
