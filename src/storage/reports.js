import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import config from "../config/config.js";

function getReportPath(city, date) {
  const safeCity = city
    .trim()
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_");

  return path.join(
    config.reportsDir,
    `${safeCity}-${date}.json`
  );
}

export async function saveReport(city, report) {
  await mkdir(config.reportsDir, { recursive: true });

  const filePath = getReportPath(city, report.date);

  await writeFile(
    filePath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  return filePath;
}

export async function loadCachedReport(city, date) {
  const filePath = getReportPath(city, date);

  try {
    const content = await readFile(filePath, "utf8");

    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    if (error instanceof SyntaxError) {
      return null;
    }

    throw new Error(
      `Не удалось прочитать отчёт: ${error.message}`
    );
  }
}