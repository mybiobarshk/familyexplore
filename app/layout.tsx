import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "家庭系統自我探索工具",
  description: "用幾分鐘整理感受、家庭經驗與現實選擇，看見重複模式，重新選擇自己的位置。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-HK">
      <body className="antialiased">{children}</body>
    </html>
  );
}
