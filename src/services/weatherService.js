import {
  geocodeCity,
  getForecast
} from "../api/openMeteo.js";

import {
  loadCachedReport,
  saveReport
} from "../storage/reports.js";

export async function getWeatherForCity(city, days, noCache) {
  const today = new Date().toISOString().slice(0, 10);

  if (!noCache) {
    const cachedReport = await loadCachedReport(city, today);

    if (
      cachedReport &&
      Array.isArray(cachedReport.forecast) &&
      cachedReport.forecast.length === days
    ) {
      return {
        ...cachedReport,
        cached: true
      };
    }
  }

  const location = await geocodeCity(city);

  const forecast = await getForecast(
    location.latitude,
    location.longitude,
    days
  );

  const report = {
    date: today,
    city: location.name,
    country: location.country,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    forecast
  };

  await saveReport(city, report);

  return {
    ...report,
    cached: false
  };
}