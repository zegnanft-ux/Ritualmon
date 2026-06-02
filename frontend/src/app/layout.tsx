import type { Metadata } from "next";
import { Bangers, Patrick_Hand, Caveat_Brush } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const bannerFont = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-banner",
});

const handFont = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

const brushFont = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brush",
});

export const metadata: Metadata = {
  title: "Ritualmon",
  description: "Collect the faces of the Ritual community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bannerFont.variable} ${handFont.variable} ${brushFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
