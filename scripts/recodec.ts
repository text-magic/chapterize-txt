import path from "node:path";

import { Command } from "commander";
import { SingleBar, Presets } from "cli-progress";
import { glob } from "fast-glob";
import * as matter from "gray-matter";

import { toUTF8 } from "../lib/to-utf8";

const program = new Command();
program.version("0.0.1").description("Convert text file to UTF-8 encoding");

setTimeout(() => program.parseAsync());

program
  .command("recodec")
  .description("Convert text file to UTF-8 encoding")
  .argument("<path>", "Input file path")
  .option("--out <out>", "Output file path")
  .option("--limit <limit>", "Limit number of files to process")
  .action(async (inputPath, options) => {
    console.log(inputPath, options);
    const files = await glob(["**/*.txt"], { cwd: inputPath });

    const bar = new SingleBar({}, Presets.shades_classic);
    bar.start(files.length, 0);

    const processFiles = files.slice();
    for (const file of processFiles) {
      const srcpath = path.join(inputPath, file);
      const dstpath = path.join(options.out, file);

      const text = await toUTF8(srcpath);
      if (!text) {
        console.log(`Failed to convert ${file}`);
        continue;
      }

      try {
        // If a file starts with "---", add a newline before it avoid matter error
        const cleanedText = text.startsWith("---") ? text.replace(/^---/, "\n------") : text;
        const matterText = matter.stringify(cleanedText, {
          name: path.basename(file),
          path: path.dirname(file),
        });
        await Bun.write(dstpath, matterText);
      } catch (error) {
        console.log(`Failed to convert ${file}: ${error}`);
      }

      bar.increment();
    }
    bar.stop();
  });

program
  .command("toutf8")
  .description("Convert text file to UTF-8 encoding")
  .argument("<file>", "Input file path")
  .option("--out <out>", "Output file path")
  .action(async (file, options) => {
    const text = await toUTF8(file);
    if (!text) {
      return;
    }

    // If a file starts with "---", add a newline before it avoid matter error
    const cleanedText = text.startsWith("---") ? text.replace(/^---/, "\n------") : text;

    const absolutePath = path.resolve(process.cwd(), file);
    const out = path.join(options.out, path.basename(file));
    const matterText = matter.stringify(cleanedText, {
      lang: "utf-8",
      name: path.basename(file),
      path: absolutePath,
    });
    console.log(absolutePath);
    await Bun.write(out, matterText);
  });

program
  .command("debug")
  .description("Debug")
  .action(() => {
    const matterText = matter.stringify(`\n---text`, {
      lang: "utf-8",
    });
    console.log(matterText);
  });
