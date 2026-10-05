import type { Metadata } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";

import { TEAM_NAME } from "@/lib/constants";

import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "vietnamese"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700"],
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: { default: TEAM_NAME, template: `%s · ${TEAM_NAME}` },
  description: `Đội hình, lịch thi đấu và thống kê của đội bóng ${TEAM_NAME}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
