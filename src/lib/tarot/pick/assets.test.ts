import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { CARD_BACK_GRID_SRC, CARD_BACK_LARGE_SRC, cardFaceArt } from "./assets";

const publicPath = (src: string) => path.join(process.cwd(), "public", src);

describe("cardFaceArt", () => {
  it("maps every deck card to a shipped engraved face", () => {
    for (const card of TAROT_DECK) {
      const art = cardFaceArt(card.image);
      expect(art?.engraved, card.id).toBe(true);
      expect(existsSync(publicPath(art!.src)), art!.src).toBe(true);
    }
  });

  it("keeps images outside the scan set untreated", () => {
    expect(cardFaceArt("/card/99.png")).toEqual({ src: "/card/99.png", engraved: false });
    expect(cardFaceArt("https://www.reffortune.com/x.png")).toEqual({
      src: "https://www.reffortune.com/x.png",
      engraved: false,
    });
    expect(cardFaceArt(undefined)).toBeNull();
  });
});

describe("card back exports", () => {
  it("ship both sizes", () => {
    expect(existsSync(publicPath(CARD_BACK_GRID_SRC))).toBe(true);
    expect(existsSync(publicPath(CARD_BACK_LARGE_SRC))).toBe(true);
  });
});
