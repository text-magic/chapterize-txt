import { expect, test, describe } from "bun:test";

import { toParagraph } from "./to-paragraph";

describe("toParagraph", () => {
  test("simple", () => {
    const text = "Hello\n\nWorld";
    const expected = ["Hello", "World"];
    const result = toParagraph(text);
    expect(result).toEqual(expected);
  });

  test("advanced", () => {
    const text = "Hello\nWorld";
    const expected = ["Hello\nWorld"];
    const result = toParagraph(text);
    expect(result).toEqual(expected);
  });
});
