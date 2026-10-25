import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible, Young_Serif } from "next/font/google";
import { RsvpProvider } from "@/providers/RsvpProvider";
import "./globals.css";

const display = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Lunch at Grandma's", template: "%s · Lunch at Grandma's" },
  description: "Who's coming to Friday lunch at Grandma's, and what they're bringing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1a17" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <RsvpProvider>{children}</RsvpProvider>
      </body>
    </html>
  );
}
