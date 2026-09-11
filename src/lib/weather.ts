/**
 * Weather data layer.
 *
 * This module is deliberately isomorphic: the normalisers, the unit helpers
 * and the URL builders run both during the build (server side, with an
 * in-memory cache) and in the browser (after the live refresh), so the page
 * and the refresh always agree on what the numbers mean.
 *
 * Two public, key-less endpoints are used:
 *  - the forecast endpoint for the 7-day outlook at the fort;
 *  - the marine endpoint for sea state and tide, because the site stands on a
 *    headland above an open bay and "should I go down to the rocks?" is a real
 *    question for a visitor.
 */

export interface CurrentFacts {
  temperature: number;
  apparent: number;
  humidity: number;
  precipitation: number;
  wind: number;
  gust: number;
  code: number;
  isDay: boolean;
}

export interface DayFacts {
  date: string;
  code: number;
  max: number;
  min: number;
  rainChance: number;
  precipSum: number;
  windMax: number;
  gustMax: number;
  uv: number | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface TideEvent {
  type: 'high' | 'low';
  /** Minutes since midnight of the first sampled day. */
  offset: number;
  /** "HH:MM" wall clock in the site timezone. */
  time: string;
  date: string;
  /** Water level in metres relative to mean sea level. */
  height: number;
}

export interface TidePoint {
  /** Minutes since midnight of the first sampled day. */
  offset: number;
  height: number;
}

export interface TideDay {
  date: string;
  startOffset: number;
  events: TideEvent[];
  lowest: number | null;
  highest: number | null;
}

export interface MarineFacts {
  waveHeight: number | null;
  wavePeriod: number | null;
  seaTemp: number | null;
  waveMaxToday: number | null;
  /** High and low water for the first day. */
  tide: TideEvent[];
  /** Hourly water level across the whole requested window. */
  series: TidePoint[];
  /** The same data grouped per day, for the multi-day outlook. */
  tideDays: TideDay[];
  updatedAt: string;
}

export interface ForecastFacts {
  current: CurrentFacts;
  daily: DayFacts[];
  updatedAt: string;
}

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';
const MARINE_ENDPOINT = 'https://marine-api.open-meteo.com/v1/marine';
const TIMEZONE = 'America/Santiago';

/** How long a server-side snapshot stays usable. */
const TTL_MS = 20 * 60 * 1000;
/** Keeps builds from hanging if the network is unavailable. */
const TIMEOUT_MS = 6000;

let forecastCache: { at: number; data: ForecastFacts } | null = null;
let marineCache: { at: number; data: MarineFacts } | null = null;

// ---------------------------------------------------------------- look-ups

/** Maps a WMO weather code onto one of our display groups. */
export function weatherGroup(code: number | null | undefined): string {
  if (code == null) return 'partlyCloudy';
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'partlyCloudy';
}

export function weatherEmoji(code: number | null | undefined, isDay = true): string {
  switch (weatherGroup(code)) {
    case 'clear':
      return isDay ? '☀️' : '🌙';
    case 'mainlyClear':
      return isDay ? '🌤️' : '🌙';
    case 'partlyCloudy':
      return isDay ? '⛅' : '☁️';
    case 'overcast':
      return '☁️';
    case 'fog':
      return '🌫️';
    case 'drizzle':
    case 'showers':
      return '🌦️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '🌨️';
    case 'thunderstorm':
      return '⛈️';
    default:
      return '⛅';
  }
}

/** Beaufort scale (force 0–12) from a 10 m mean wind speed in km/h. */
export function beaufort(kmh: number | null | undefined): number {
  const v = typeof kmh === 'number' && Number.isFinite(kmh) ? kmh : 0;
  const limits = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  for (let i = 0; i < limits.length; i++) {
    if (v < limits[i]) return i;
  }
  return 12;
}

/** Locale used for weekday / month formatting per UI language. */
export function weatherLocale(lang: string): string {
  if (lang === 'en') return 'en-US';
  if (lang === 'zh') return 'zh-CN';
  return 'es-CL';
}

// ------------------------------------------------------------- normalisers

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function maybe(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function hhmm(value: unknown): string | null {
  return typeof value === 'string' && value.length >= 16 ? value.slice(11, 16) : null;
}

/** Minutes past midnight of a "YYYY-MM-DDTHH:MM" stamp. */
function minutesOf(stamp: string): number {
  return Number(stamp.slice(11, 13)) * 60 + Number(stamp.slice(14, 16));
}

/** Whole days between two "YYYY-MM-DD" dates. */
function dayGap(from: string, to: string): number {
  const asUtc = (date: string) =>
    Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)));
  return Math.round((asUtc(to) - asUtc(from)) / 86400000);
}

export function normalizeForecast(raw: any): ForecastFacts | null {
  const c = raw?.current ?? {};
  const d = raw?.daily ?? {};
  const count: number = Array.isArray(d.time) ? d.time.length : 0;
  if (!count) return null;

  return {
    current: {
      temperature: Math.round(num(c.temperature_2m)),
      apparent: Math.round(num(c.apparent_temperature)),
      humidity: Math.round(num(c.relative_humidity_2m)),
      precipitation: Math.round(num(c.precipitation) * 10) / 10,
      wind: Math.round(num(c.wind_speed_10m)),
      gust: Math.round(num(c.wind_gusts_10m)),
      code: num(c.weather_code),
      isDay: num(c.is_day) === 1,
    },
    daily: Array.from({ length: count }, (_, i) => ({
      date: String(d.time[i]),
      code: num(d.weather_code?.[i]),
      max: Math.round(num(d.temperature_2m_max?.[i])),
      min: Math.round(num(d.temperature_2m_min?.[i])),
      rainChance: Math.round(num(d.precipitation_probability_max?.[i])),
      precipSum: Math.round(num(d.precipitation_sum?.[i]) * 10) / 10,
      windMax: Math.round(num(d.wind_speed_10m_max?.[i])),
      gustMax: Math.round(num(d.wind_gusts_10m_max?.[i])),
      uv: maybe(d.uv_index_max?.[i]),
      sunrise: hhmm(d.sunrise?.[i]),
      sunset: hhmm(d.sunset?.[i]),
    })),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Turns the hourly tide curve into the pieces the page needs: the raw series,
 * the high and low water marks, and a per-day grouping.
 *
 * The API returns wall-clock stamps already shifted to the site timezone, so
 * everything is measured in minutes from midnight of the first sampled day.
 * That keeps the arithmetic off the host machine's own timezone, and it works
 * the same during the build and in the visitor's browser.
 */
export function buildTide(
  times: unknown,
  heights: unknown
): { series: TidePoint[]; events: TideEvent[]; days: TideDay[] } {
  const empty = { series: [], events: [], days: [] };
  if (!Array.isArray(times) || !Array.isArray(heights)) return empty;

  const samples: { offset: number; height: number; date: string; time: string }[] = [];
  let base: string | null = null;

  for (let i = 0; i < times.length; i++) {
    const stamp = String(times[i] ?? '');
    const height = maybe(heights[i]);
    if (stamp.length < 16 || height === null) continue;
    const date = stamp.slice(0, 10);
    if (!base) base = date;
    samples.push({
      offset: dayGap(base, date) * 1440 + minutesOf(stamp),
      height: Math.round(height * 100) / 100,
      date,
      time: stamp.slice(11, 16),
    });
  }
  if (samples.length < 3 || !base) return empty;

  samples.sort((a, b) => a.offset - b.offset);

  // A smooth hourly curve makes a local-extremum scan exact to the hour, which
  // is all a visitor needs. Two highs in a row mean a flat crest: keep the first.
  const events: TideEvent[] = [];
  for (let i = 1; i < samples.length - 1; i++) {
    const prev = samples[i - 1].height;
    const cur = samples[i].height;
    const next = samples[i + 1].height;
    const type: TideEvent['type'] | null =
      cur > prev && cur >= next ? 'high' : cur < prev && cur <= next ? 'low' : null;
    if (!type) continue;
    if (events.length && events[events.length - 1].type === type) continue;
    events.push({
      type,
      offset: samples[i].offset,
      time: samples[i].time,
      date: samples[i].date,
      height: cur,
    });
  }

  const series: TidePoint[] = samples.map((p) => ({ offset: p.offset, height: p.height }));

  const days: TideDay[] = [];
  for (const sample of samples) {
    let day = days[days.length - 1];
    if (!day || day.date !== sample.date) {
      day = { date: sample.date, startOffset: sample.offset, events: [], lowest: null, highest: null };
      days.push(day);
    }
    if (day.lowest === null || sample.height < day.lowest) day.lowest = sample.height;
    if (day.highest === null || sample.height > day.highest) day.highest = sample.height;
  }
  for (const day of days) day.events = events.filter((event) => event.date === day.date);

  return { series, events, days };
}

// ------------------------------------------------------------------- tides

/** "HH:MM" label for a minutes-since-first-day offset. */
export function tideTimeLabel(offset: number): string {
  const minutes = ((Math.round(offset) % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/** Wall-clock date and minutes-of-day for the site timezone. */
export function localClock(timeZone: string, at: Date = new Date()): { date: string; minutes: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(at);
    const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
    const hour = value('hour') === '24' ? '00' : value('hour');
    return {
      date: `${value('year')}-${value('month')}-${value('day')}`,
      minutes: Number(hour) * 60 + Number(value('minute')),
    };
  } catch {
    return { date: at.toISOString().slice(0, 10), minutes: at.getUTCHours() * 60 + at.getUTCMinutes() };
  }
}

/** Where "now" sits inside a tide series, or null when there is no series. */
export function tideNowOffset(days: TideDay[], timeZone: string, at: Date = new Date()): number | null {
  if (!days.length) return null;
  const now = localClock(timeZone, at);
  return dayGap(days[0].date, now.date) * 1440 + now.minutes;
}

/** Linear interpolation of the water level at an arbitrary offset. */
export function tideHeightAt(series: TidePoint[], offset: number): number | null {
  if (!series.length) return null;
  if (offset <= series[0].offset) return series[0].height;
  const last = series[series.length - 1];
  if (offset >= last.offset) return last.height;

  for (let i = 1; i < series.length; i++) {
    const a = series[i - 1];
    const b = series[i];
    if (offset > b.offset) continue;
    const span = b.offset - a.offset;
    if (span <= 0) return b.height;
    const ratio = (offset - a.offset) / span;
    return Math.round((a.height + (b.height - a.height) * ratio) * 100) / 100;
  }
  return last.height;
}

export interface TideState {
  height: number | null;
  /** Water is coming up when the next turn of the tide is a high water. */
  rising: boolean;
  next: TideEvent | null;
  minutesUntilNext: number | null;
}

export function tideState(series: TidePoint[], events: TideEvent[], nowOffset: number): TideState {
  const next = events.find((event) => event.offset > nowOffset) ?? null;
  return {
    height: tideHeightAt(series, nowOffset),
    rising: next ? next.type === 'high' : true,
    next,
    minutesUntilNext: next ? Math.round(next.offset - nowOffset) : null,
  };
}

/**
 * Maps one day of the tide curve onto an SVG box. Returns the polyline plus the
 * two scalers, so markers can be placed with exactly the same geometry.
 */
export function tideGeometry(
  series: TidePoint[],
  dayStart: number,
  width: number,
  height: number,
  pad = 8
): { path: string; x: (offset: number) => number; y: (value: number) => number } | null {
  const day = series.filter((p) => p.offset >= dayStart && p.offset <= dayStart + 1440);
  if (day.length < 2) return null;

  let low = Infinity;
  let high = -Infinity;
  for (const point of day) {
    if (point.height < low) low = point.height;
    if (point.height > high) high = point.height;
  }
  // A nearly flat day would otherwise fill the whole box.
  const span = Math.max(high - low, 0.3);
  const middle = (high + low) / 2;
  const top = middle + span / 2;
  const bottom = middle - span / 2;

  const x = (offset: number) => pad + ((offset - dayStart) / 1440) * (width - pad * 2);
  const y = (value: number) => pad + ((top - value) / (top - bottom)) * (height - pad * 2);
  const path = day.map((p) => `${x(p.offset).toFixed(1)},${y(p.height).toFixed(1)}`).join(' ');

  return { path, x, y };
}

export interface TideWindow {
  startOffset: number;
  endOffset: number;
  /** True when the window overlaps daylight, which is when visitors are out. */
  daylight: boolean;
}

/** How far either side of low water the rocks are at their most walkable. */
const LOW_TIDE_MARGIN = 90;

/**
 * The window around each low water. Around low tide the foreshore opens up and
 * the rocks are at their least hazardous, which is the moment a visitor
 * actually wants to know about.
 */
export function lowTideWindows(
  events: TideEvent[],
  baseDate: string,
  sunrise: string | null,
  sunset: string | null
): TideWindow[] {
  const toMinutes = (value: string | null) =>
    value && value.length >= 5 ? Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5)) : null;
  const rise = toMinutes(sunrise);
  const set = toMinutes(sunset);

  const windows: TideWindow[] = [];
  for (const event of events) {
    if (event.type !== 'low') continue;
    const startOffset = event.offset - LOW_TIDE_MARGIN;
    const endOffset = event.offset + LOW_TIDE_MARGIN;
    const dayStart = dayGap(baseDate, event.date) * 1440;
    const daylight =
      rise === null || set === null
        ? true
        : endOffset > dayStart + rise && startOffset < dayStart + set;
    windows.push({ startOffset, endOffset, daylight });
  }
  return windows.slice(0, 2);
}

export function normalizeMarine(raw: any): MarineFacts | null {
  const c = raw?.current ?? {};
  const d = raw?.daily ?? {};
  const hourly = raw?.hourly ?? {};
  if (c.wave_height == null && c.sea_surface_temperature == null && !hourly.time) return null;

  const tide = buildTide(hourly.time, hourly.sea_level_height_msl);

  return {
    waveHeight: maybe(c.wave_height),
    wavePeriod: maybe(c.wave_period),
    seaTemp: maybe(c.sea_surface_temperature),
    waveMaxToday: maybe(d.wave_height_max?.[0]),
    tide: tide.days[0]?.events ?? [],
    series: tide.series,
    tideDays: tide.days,
    updatedAt: new Date().toISOString(),
  };
}

// ----------------------------------------------------------- url builders

export function forecastUrl(latitude: number, longitude: number, days = 7): string {
  const url = new URL(FORECAST_ENDPOINT);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset'
  );
  url.searchParams.set('timezone', TIMEZONE);
  url.searchParams.set('forecast_days', String(days));
  return url.toString();
}

export function marineUrl(latitude: number, longitude: number, days = 3): string {
  const url = new URL(MARINE_ENDPOINT);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'wave_height,wave_period,sea_surface_temperature');
  url.searchParams.set('daily', 'wave_height_max,wave_period_max,sea_surface_temperature_max');
  url.searchParams.set('hourly', 'sea_level_height_msl');
  url.searchParams.set('timezone', TIMEZONE);
  url.searchParams.set('forecast_days', String(days));
  return url.toString();
}

// --------------------------------------------------- server-side retrieval

async function getJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Cached, build-safe forecast retrieval (server side only). */
export async function getWeather(
  latitude: number,
  longitude: number,
  days = 7
): Promise<ForecastFacts | null> {
  if (forecastCache && Date.now() - forecastCache.at < TTL_MS) return forecastCache.data;
  const data = normalizeForecast(await getJson(forecastUrl(latitude, longitude, days)));
  if (!data) return null;
  forecastCache = { at: Date.now(), data };
  return data;
}

/** Cached, build-safe sea state retrieval (server side only). */
export async function getMarine(latitude: number, longitude: number): Promise<MarineFacts | null> {
  if (marineCache && Date.now() - marineCache.at < TTL_MS) return marineCache.data;
  const data = normalizeMarine(await getJson(marineUrl(latitude, longitude)));
  if (!data) return null;
  marineCache = { at: Date.now(), data };
  return data;
}
