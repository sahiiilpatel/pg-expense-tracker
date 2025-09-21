import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function readJSON(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function writeJSON(fileName, data) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
