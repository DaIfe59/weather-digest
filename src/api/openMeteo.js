import config from "../config/config.js";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson(url) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    config.requestTimeoutMs
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new ApiError(
          `API вернул ошибку клиента: HTTP ${response.status}.`,
          response.status
        );
      }

      if (response.status >= 500) {
        throw new ApiError(
          `API вернул ошибку сервера: HTTP ${response.status}.`,
          response.status
        );
      }

      throw new ApiError(
        `API вернул HTTP ${response.status}.`,
        response.status
      );
    }

    try {
      return await response.json();
    } catch {
      throw new Error("API вернул некорректный JSON.");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Превышено время ожидания ответа API (${config.requestTimeoutMs} мс).`
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error("Не удалось подключиться к API.");
  } finally {
    clearTimeout(timeout);
  }
}

export async function geocodeCity(city) {
  const url = new URL(config.geocodingApiUrl);

  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "ru",
    format: "json"
  }).toString();

  const data = await fetchJson(url);

  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new Error(`Город "${city}" не найден.`);
  }

  const result = data.results[0];

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude
  };
}

export async function getForecast(latitude, longitude, days) {
  const url = new URL(config.forecastApiUrl);

  const temperatureUnit =
    config.temperatureUnit === "fahrenheit"
      ? "fahrenheit"
      : "celsius";

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum",
    forecast_days: String(days),
    timezone: "auto",
    temperature_unit: temperatureUnit
  }).toString();

  const data = await fetchJson(url);

  if (
    !data.daily ||
    !Array.isArray(data.daily.time) ||
    !Array.isArray(data.daily.temperature_2m_min) ||
    !Array.isArray(data.daily.temperature_2m_max) ||
    !Array.isArray(data.daily.precipitation_sum)
  ) {
    throw new Error(
      "API вернул данные прогноза в неожиданном формате."
    );
  }

  return data.daily.time.map((date, index) => ({
    date,
    minTemperature: data.daily.temperature_2m_min[index],
    maxTemperature: data.daily.temperature_2m_max[index],
    precipitation: data.daily.precipitation_sum[index]
  }));
}