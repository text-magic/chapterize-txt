import path from "node:path";

import { Command } from "commander";
import { chapterize } from "../lib/chapterize";

const program = new Command();
program.version("0.0.1").description("Extract chapter titles from text file");

setTimeout(() => program.parseAsync());

program
  .command("chapter")
  .description("Extract chapter titles from text file")
  .argument("<path>", "Input file path")
  .action(async (inputPath) => {
    const filePath = path.join(process.cwd(), inputPath);
    const fileContent = await Bun.file(filePath).text();
    const titles = chapterize(fileContent);

    console.log(JSON.stringify(titles, null, 2));
  });
