import path from "node:path";

import { Command } from "commander";
import { glob } from "fast-glob";
import { SingleBar, Presets } from "cli-progress";

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
      await Bun.write(dstpath, text);
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
    const out = path.join(options.out, path.basename(file));
    await Bun.write(out, text);
  });
