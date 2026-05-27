import * as fs from "fs";
import * as path from "path";
import { parseInput } from "./parser/parser";
import { buildXml } from "./render-xml/render-xml";

const DEFAULT_INPUT_PATH = path.join(process.cwd(), "src", "assets", "input.txt");
const DEFAULT_OUTPUT_PATH = path.join(process.cwd(), "src", "assets", "output.xml");

function resolveInputPath(rawInputPath?: string): string {
  return rawInputPath
    ? path.resolve(process.cwd(), rawInputPath)
    : DEFAULT_INPUT_PATH;
}

function convert(): void {
  try {
    const rawInputPath = process.argv[2];
    const inputPath = resolveInputPath(rawInputPath);
    const input = fs.readFileSync(inputPath, "utf-8");
    const xml = buildXml(parseInput(input));

    fs.writeFileSync(DEFAULT_OUTPUT_PATH, xml, "utf-8");
    console.log("File converted to XML. See output.xml under assets.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Conversion failed: ${message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  convert();
}