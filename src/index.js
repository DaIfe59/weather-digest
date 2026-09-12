import { parseArgs } from "./cli/args.js";
import { getWeatherForCity } from "./services/weatherService.js";
import { printReports } from "./format/console.js";

async function main() {
  const { cities, days, noCache } = parseArgs(process.argv.slice(2));

  const results = await Promise.allSettled(
    cities.map((city) => getWeatherForCity(city, days, noCache))
  );

  printReports(results);

  const hasErrors = results.some(
    (result) => result.status === "rejected"
  );

  if (hasErrors) {
    process.exitCode = 1;
  }
}

try {
  await main();
} catch (error) {
  console.error(`Ошибка: ${error.message}`);
  process.exitCode = 1;
}