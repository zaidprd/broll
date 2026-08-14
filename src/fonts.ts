// src/fonts.ts
// ============================================================
// Font system — pakai @remotion/google-fonts (proven work for Remotion).
// @fontsource tetap di-import untuk live preview di UI browser.
// ============================================================

import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadGreatVibes } from "@remotion/google-fonts/GreatVibes";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: plusJakarta } = loadPlusJakarta("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: plusJakartaItalic } = loadPlusJakarta("italic", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: inter } = loadInter("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const { fontFamily: instrumentSerif } = loadInstrumentSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: jetBrainsMono } = loadJetBrainsMono("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: greatVibes } = loadGreatVibes("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: playfairItalic } = loadPlayfair("italic", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

export const fonts = {
  display: plusJakarta,
  displayItalic: plusJakartaItalic,
  sans: inter,
  classic: instrumentSerif,
  mono: jetBrainsMono,
  script: greatVibes,
  playfair: playfairItalic,
} as const;

export type FontKey = keyof typeof fonts;

export const getFontFamily = (key?: FontKey): string => {
  if (key && fonts[key]) return fonts[key];
  return fonts.display;
};
