const DEFAULT_DAYS = 3;
const MIN_DAYS = 1;
const MAX_DAYS = 7;

export function parseArgs(argv) {
  const args = {
    cities: [],
    days: DEFAULT_DAYS,
    noCache: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i];

    if (argument === "--city") {
      const value = argv[i + 1];

      if (!value || value.startsWith("--")) {
        throw new Error("Параметр --city должен содержать название города.");
      }

      args.cities = value
        .split(",")
        .map((city) => city.trim())
        .filter(Boolean);

      if (args.cities.length === 0) {
        throw new Error("Необходимо указать хотя бы один город.");
      }

      i += 1;
      continue;
    }

    if (argument === "--days") {
      const value = argv[i + 1];

      if (!value || value.startsWith("--")) {
        throw new Error("Параметр --days должен содержать число.");
      }

      const days = Number(value);

      if (!Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
        throw new Error("Параметр --days должен быть целым числом от 1 до 7.");
      }

      args.days = days;
      i += 1;
      continue;
    }

    if (argument === "--no-cache") {
      args.noCache = true;
      continue;
    }

    throw new Error(`Неизвестный аргумент: ${argument}`);
  }

  if (args.cities.length === 0) {
    throw new Error("Параметр --city является обязательным.");
  }

  return args;
}