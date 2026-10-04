// Generates public/og.png (1200x630) for WhatsApp/Instagram sharing.
// Runs as the `prebuild` npm hook, so the image is always fresh.
// Uses satori + resvg-js — no @vercel/og bundled into Next, no network at build time.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { createElement as h } from "react";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const readFont = (pkg, file) =>
  readFileSync(join(root, "node_modules", "@fontsource", pkg, "files", file));

const fonts = [
  readFont("cinzel-decorative", "cinzel-decorative-latin-900-normal.woff"),
  readFont("eb-garamond", "eb-garamond-latin-400-normal.woff"),
  readFont("eb-garamond", "eb-garamond-latin-700-normal.woff"),
  readFont("eb-garamond", "eb-garamond-latin-400-italic.woff"),
];

const tree = h(
  "div",
  {
    style: {
      width: 1200,
      height: 630,
      backgroundColor: "#0A0A0A",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: 48,
    },
  },
  h("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      height: 380,
      background: "radial-gradient(circle at 50% 0%, rgba(107,15,26,0.6), rgba(107,15,26,0) 70%)",
    },
  }),
  h("div", {
    style: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      height: 320,
      background: "radial-gradient(circle at 50% 100%, rgba(0,0,0,0.9), rgba(0,0,0,0) 70%)",
    },
  }),
  h("div", {
    style: {
      position: "absolute",
      left: 28,
      top: 28,
      right: 28,
      bottom: 28,
      border: "1px solid rgba(201,162,39,0.55)",
    },
  }),
  // Wordmark
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
    h(
      "div",
      {
        style: {
          fontFamily: "CinzelDecorative",
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: 14,
          color: "#E4C765",
          display: "flex",
        },
      },
      "RH",
    ),
    h(
      "div",
      {
        style: {
          fontFamily: "EBGaramond",
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: 26,
          color: "#EFE6D8",
          marginTop: 6,
          display: "flex",
        },
      },
      "2026",
    ),
  ),
  // Organizer eyebrow
  h(
    "div",
    {
      style: {
        fontFamily: "EBGaramond",
        fontWeight: 400,
        fontSize: 20,
        letterSpacing: 10,
        color: "#C9A227",
        textTransform: "uppercase",
        marginTop: 40,
        display: "flex",
      },
    },
    "Whitehat Club · Department of Cyber Security",
  ),
  // Tagline
  h(
    "div",
    {
      style: {
        fontFamily: "EBGaramond",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 24,
        color: "#C9BBA3",
        marginTop: 22,
        display: "flex",
      },
    },
    "Find the flaws. Heal the system. Defend your fix.",
  ),
  // Rule + college
  h(
    "div",
    { style: { display: "flex", flexDirection: "row", alignItems: "center", gap: 18, marginTop: 30 } },
    h("div", { style: { width: 90, height: 1, backgroundColor: "#C9A227", opacity: 0.7 } }),
    h(
      "div",
      {
        style: {
          fontFamily: "EBGaramond",
          fontWeight: 400,
          fontSize: 19,
          letterSpacing: 6,
          color: "#EFE6D8",
          textTransform: "uppercase",
          display: "flex",
        },
      },
      "SRM Valliammai Engineering College · Kattankulathur",
    ),
    h("div", { style: { width: 90, height: 1, backgroundColor: "#C9A227", opacity: 0.7 } }),
  ),
);

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "CinzelDecorative", data: fonts[0], weight: 900, style: "normal" },
    { name: "EBGaramond", data: fonts[1], weight: 400, style: "normal" },
    { name: "EBGaramond", data: fonts[2], weight: 700, style: "normal" },
    { name: "EBGaramond", data: fonts[3], weight: 400, style: "italic" },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "og.png"), png);
console.log("public/og.png written:", png.byteLength, "bytes");