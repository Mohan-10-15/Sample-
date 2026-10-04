import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Courier_Prime, EB_Garamond } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Overlays } from "@/components/motifs";

const display = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const head = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-head",
  display: "swap",
});

const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-typewriter",
  display: "swap",
});

const title = `Reverse Hackathon 2026 — Reverse Hackathon | ${siteConfig.college}`;
const description =
  "A reverse hackathon by the Whitehat Club, Department of Cyber Security, SRM Valliammai Engineering College. Teams receive an already-built, deliberately vulnerable system — and must find, patch and defend it before the Family. Form your family, register today.";

export const metadata: Metadata = {
  metadataBase: new URL("https://reverse-hack.vercel.app"),
  title,
  description,
  applicationName: "Reverse Hackathon 2026",
  keywords: [
    "reverse hackathon",
    "hackathon",
    "cyber security",
    "Whitehat Club",
    "SRM Valliammai",
    "Chennai",
    "Reverse Hackathon 2026",
    "CTF",
    "application security",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title,
    description,
    siteName: "Reverse Hackathon 2026",
    url: "/",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${head.variable} ${body.variable} ${typewriter.variable}`}>
        <Overlays />
        {children}
      </body>
    </html>
  );
}