import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Board Game Universe | KingDragonHub",
  description: "Bản thử nghiệm nền tảng Board Game Universe: chơi, học, sáng tạo."
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="vi"><body><a href="#main-content" className="skip-link">Chuyển đến nội dung chính</a>{children}</body></html>;
}
