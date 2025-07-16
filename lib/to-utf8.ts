import createDebug from "debug";
import chardet from "chardet";
import iconv from "iconv-lite";

const errorlog = createDebug("utf8:error");
const infolog = createDebug("utf8:info");
const verbose = createDebug("utf8:verbose");

export async function toUTF8(file: string): Promise<string | null> {
  const arrbuf = await Bun.file(file).arrayBuffer();
  const buffer = Buffer.from(arrbuf);

  const detectedEncoding = chardet.detect(buffer);

  if (!detectedEncoding) {
    errorlog(`Failed to detect encoding for file ${file}`);
    return null;
  }

  infolog(`File ${file} is ${detectedEncoding}`);

  if (!iconv.encodingExists(detectedEncoding!)) {
    errorlog(`Encoding ${detectedEncoding} is not supported`);
    return null;
  }

  try {
    const decodedText = iconv.decode(buffer, detectedEncoding);
    verbose(decodedText);
    return decodedText;
  } catch (error) {
    errorlog(`Failed to decode file ${file}: ${error}`);
    return null;
  }
}
