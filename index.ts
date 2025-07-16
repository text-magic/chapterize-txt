import path from "node:path";
import { chapterize, isChapterTitle } from "./lib/chapterize";

const filePath = path.join(__dirname, "tests", "sample.txt");
const fileContent = await Bun.file(filePath).text();
const titles = chapterize(fileContent);

console.log(JSON.stringify(titles, null, 2));
