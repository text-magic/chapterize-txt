import { expect, test, describe } from "bun:test";

import { toParagraphs } from "./to-paragraph";

describe("toParagraph", () => {
  test("simple", () => {
    const text = "Hello\n\nWorld";
    const expected = ["Hello", "World"];
    const result = toParagraphs(text);
    expect(result).toEqual(expected);
  });

  test("advanced", () => {
    const text = "Hello\nWorld";
    const expected = ["Hello\nWorld"];
    const result = toParagraphs(text, { mode: "advanced" });
    expect(result).toEqual(expected);
  });
});
