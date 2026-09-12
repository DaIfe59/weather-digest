const requestTimeoutMs = Number(
  process.env.REQUEST_TIMEOUT_MS || 5000
);

if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
  throw new Error(
    "REQUEST_TIMEOUT_MS должен быть положительным целым числом."
  );
}

const temperatureUnit =
  process.env.TEMPERATURE_UNIT || "celsius";

if (!["celsius", "fahrenheit"].includes(temperatureUnit)) {
  throw new Error(
    'TEMPERATURE_UNIT должен быть "celsius" или "fahrenheit".'
  );
}

const config = {
  geocodingApiUrl:
    process.env.GEOCODING_API_URL ||
    "https://geocoding-api.open-meteo.com/v1/search",

  forecastApiUrl:
    process.env.FORECAST_API_URL ||
    "https://api.open-meteo.com/v1/forecast",

  requestTimeoutMs,

  reportsDir:
    process.env.REPORTS_DIR || "reports",

  temperatureUnit
};

export default config;