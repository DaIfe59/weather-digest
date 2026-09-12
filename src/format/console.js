import config from "../config/config.js";

function formatTemperature(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  const unit =
    config.temperatureUnit === "fahrenheit"
      ? "°F"
      : "°C";

  return `${value.toFixed(1)} ${unit}`;
}

function formatPrecipitation(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value.toFixed(1)} мм`;
}

function printReport(report) {
  console.log("");
  console.log(`${report.city}, ${report.country}`);

  console.log(
    `Координаты: ${report.coordinates.latitude.toFixed(4)}, ` +
      `${report.coordinates.longitude.toFixed(4)}`
  );

  if (report.cached) {
    console.log("Источник: кэш");
  } else {
    console.log("Источник: API");
  }

  console.log("");

  const header = [
    "Дата".padEnd(12),
    "Мин.".padStart(10),
    "Макс.".padStart(10),
    "Осадки".padStart(12)
  ].join(" ");

  console.log(header);
  console.log("-".repeat(header.length));

  for (const day of report.forecast) {
    console.log(
      [
        day.date.padEnd(12),
        formatTemperature(day.minTemperature).padStart(10),
        formatTemperature(day.maxTemperature).padStart(10),
        formatPrecipitation(day.precipitation).padStart(12)
      ].join(" ")
    );
  }

  console.log("");
}

export function printReports(results) {
  for (const result of results) {
    if (result.status === "fulfilled") {
      printReport(result.value);
      continue;
    }

    console.error(`Ошибка: ${result.reason.message}`);
  }
}