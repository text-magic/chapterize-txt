// Keywords for chapter titles, e.g., "第1章"
const chapterKeywords = [
  "章",
  "节",
  "回",
  "節",
  "卷",
  "部",
  "輯",
  "辑",
  "話",
  "集",
  "话",
  "篇",
  " ",
  "\u3000",
];

// Keywords that disqualify a line from being a title (currently unused based on kookit)
const disqualifyingKeywords: string[] = [];

// Standalone chapter titles or prefixes
const standaloneTitles = [
  "CHAPTER",
  "Chapter",
  "序章",
  "前言",
  "声明",
  "写在前面的话",
  "后记",
  "楔子",
  "后序",
  "章节目录",
  "尾声",
  "聲明",
  "寫在前面的話",
  "後記",
  "後序",
  "章節目錄",
  "尾聲",
];

// Separators used in some title formats, e.g., "1. Title"
const titleSeparators = [" ", "\u3000", "、", "·", ".", "：", ":"];

// Regex for Chinese and Arabic numerals
const chineseNumeralsRegex =
  /^[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07\u842c\u96f6]+$/;
const arabicNumeralsRegex = /^\d+$/;

const containsDisqualifyingKeywords = (line: string) =>
  disqualifyingKeywords.some((kw) => line.includes(kw));

const isStandaloneTitle = (line: string) =>
  standaloneTitles.some((title) => line.startsWith(title));

// Checks for titles like "123." or "一二三、".
const isNumericTitleWithSeparator = (line: string) => {
  return titleSeparators.some((separator) => {
    const separatorIndex = line.indexOf(separator);
    if (separatorIndex > 0) {
      const prefix = line.substring(0, separatorIndex);
      return chineseNumeralsRegex.test(prefix) || arabicNumeralsRegex.test(prefix);
    }
    return false;
  });
};

// Checks for titles like "第...章/节/回".
const isNumberedChapter = (line: string) => {
  // This function specifically checks for the "第...章/节/回" format.
  // It must start with '第'.
  if (!line.startsWith("第")) {
    return false;
  }

  for (const keyword of chapterKeywords) {
    const keywordIndex = line.indexOf(keyword);
    // Ensure the keyword exists and there's a number between '第' and the keyword.
    if (keywordIndex > 1) {
      const numeralPart = line.substring(1, keywordIndex).trim();
      if (
        numeralPart &&
        (chineseNumeralsRegex.test(numeralPart) || arabicNumeralsRegex.test(numeralPart))
      ) {
        return true;
      }
    }
  }
  return false;
};

// Checks for titles like "第...卷".
const isNumberedVolume = (line: string) => {
  const check = (part: string) => {
    if (!part) return false;
    const numeralPart = part.substring(1).trim();
    if (
      numeralPart &&
      (chineseNumeralsRegex.test(numeralPart) || arabicNumeralsRegex.test(numeralPart))
    ) {
      return true;
    }
    return false;
  };

  if (line.includes(" ")) {
    return check(line.substring(0, line.indexOf(" ")));
  } else if (line.includes("　")) {
    return check(line.substring(0, line.indexOf("　")));
  } else {
    return check(line);
  }
};

function isChapterTitle(line: string): boolean {
  const cleanedLine = line.trim();

  if (!cleanedLine || cleanedLine.length >= 40 || containsDisqualifyingKeywords(cleanedLine)) {
    return false;
  }

  return (
    isStandaloneTitle(cleanedLine) ||
    isNumberedChapter(cleanedLine) ||
    isNumberedVolume(cleanedLine) ||
    isNumericTitleWithSeparator(cleanedLine)
  );
}

function chapterize(text: string): string[] {
  if (!text) {
    return [];
  }

  const lines = text.split(/\r?\n/);
  const titles = [];

  for (const line of lines) {
    if (isChapterTitle(line)) {
      titles.push(line);
    }
  }

  return titles;
}

export { isChapterTitle, chapterize };
