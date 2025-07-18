import { ParseLatin } from "parse-latin";
import { toString } from "nlcst-to-string";
import { visit } from "unist-util-visit";

type Option = {
  mode: "simple" | "advanced";
};

export function toParagraphs(text: string, option: Option = { mode: "simple" }): string[] {
  if (option.mode === "simple") {
    return text.split(/(?:\r?\n){2,}/);
  }
  if (option.mode === "advanced") {
    const parser = new ParseLatin();
    const tree = parser.parse(text);
    const paragraphs: string[] = [];
    visit(tree, "ParagraphNode", (node) => {
      paragraphs.push(toString(node));
    });
    return paragraphs;
  }
  return [];
}
