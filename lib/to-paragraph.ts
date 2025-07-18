type Option = {
  mode: "simple" | "advanced";
};

export function toParagraph(text: string, option: Option = { mode: "simple" }): string[] {
  if (option.mode === "simple") {
    return text.split(/\r?\n/);
  }
  return [];
}
