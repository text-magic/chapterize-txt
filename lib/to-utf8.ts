import { Command } from "commander";
import chardet from "chardet";
import iconv from "iconv-lite";

const program = new Command();
program.version("0.0.1").description("Convert text file to UTF-8 encoding");

program
  .command("toutf8")
  .description("Convert text file to UTF-8 encoding")
  .argument("<file>", "Input file path")
  .action(async (file) => {
    const arrbuf = await Bun.file(file).arrayBuffer();
    const buffer = Buffer.from(arrbuf);

    const detectedEncoding = chardet.detect(buffer);

    if (!detectedEncoding) {
      console.log(`Failed to detect encoding for file ${file}`);
      return;
    }

    console.log(`File ${file} is ${detectedEncoding}`);

    if (!iconv.encodingExists(detectedEncoding!)) {
      console.log(`Encoding ${detectedEncoding} is not supported`);
      return;
    }

    try {
      const decodedText = iconv.decode(buffer, detectedEncoding);
      console.log(decodedText);
    } catch (error) {
      console.error(`Failed to decode file ${file}: ${error}`);
    }
  });

program.parse();
