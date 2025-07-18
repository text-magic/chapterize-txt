import path from "node:path";

import { Command } from "commander";
import { chapterize } from "../lib/chapterize";
import { toParagraph } from "../lib/to-paragraph";

const program = new Command();
program.version("0.0.1").description("Extract chapter titles from text file");

setTimeout(() => program.parseAsync());

program
  .command("chap")
  .description("Extract chapter titles from text file")
  .argument("<path>", "Input file path")
  .action(async (inputPath) => {
    const filePath = path.join(process.cwd(), inputPath);
    const fileContent = await Bun.file(filePath).text();
    const titles = chapterize(fileContent);

    console.log(JSON.stringify(titles, null, 2));
  });

program
  .command("para")
  .description("Extract chapter titles from text file")
  .argument("<path>", "Input file path")
  .action(async (inputPath) => {
    const filePath = path.join(process.cwd(), inputPath);
    const fileContent = await Bun.file(filePath).text();
    const paragraphs = toParagraph(fileContent).filter((p) => p.length > 0).map((p) => p.trim());

    console.log(paragraphs.length);
    Bun.write("outputs/paragraphs.txt", JSON.stringify(paragraphs, null, 2));
  });
