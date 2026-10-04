import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kyoto Day",
  description: "A walking day in Kyoto for an adult, or for two boys on one trail.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3eee4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
