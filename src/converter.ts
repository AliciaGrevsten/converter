import * as fs from "fs";
import * as path from "path";
import { parseInput } from "./parser";
import { buildXml } from "./xml";

function convert(): void {
  const rawInputPath = process.argv[2];
  const inputPath = rawInputPath
    ? path.resolve(process.cwd(), rawInputPath)
    : path.join(process.cwd(), "src", "assets", "input.txt");
  const outputPath = path.join(process.cwd(), "src", "assets", "output.xml");

  const input = fs.readFileSync(inputPath, "utf-8");
  const xml = buildXml(parseInput(input));

  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log("File converted to XML. See output.xml under assets.");
}

if (require.main === module) {
  convert();
}