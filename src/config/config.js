const config = {
  geocodingApiUrl:
    process.env.GEOCODING_API_URL ||
    "https://geocoding-api.open-meteo.com/v1/search",

  forecastApiUrl:
    process.env.FORECAST_API_URL ||
    "https://api.open-meteo.com/v1/forecast",

  requestTimeoutMs: Number(
    process.env.REQUEST_TIMEOUT_MS || 5000
  ),

  reportsDir: process.env.REPORTS_DIR || "reports",

  temperatureUnit:
    process.env.TEMPERATURE_UNIT || "celsius"
};

export default config;