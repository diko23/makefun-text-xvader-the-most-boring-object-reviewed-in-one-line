import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS: number = 200;
const ENTRY_LINE: string =
  "Spare shirt button: 5/5. Arrives in a tiny baggie, retires to a junk drawer on day one, and loyally outlives the shirt.";

function validateEntryLine(line: string): string {
  if (line.trim().length === 0) {
    throw new Error("Entry line must not be blank or whitespace-only.");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Entry line must be a single line with no line breaks.");
  }
  const charCount: number = [...line].length;
  if (charCount > MAX_ENTRY_CHARS) {
    throw new Error(`Entry line exceeds ${MAX_ENTRY_CHARS} characters (${charCount}).`);
  }
  return line;
}

function resolveOutputDir(): string {
  const rawDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return rawDir && rawDir.length > 0 ? rawDir : "/output";
}

function main(): void {
  const entry: string = validateEntryLine(ENTRY_LINE);
  const outputDir: string = resolveOutputDir();
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, entry, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (error: unknown) {
  const message: string = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exitCode = 1;
}
