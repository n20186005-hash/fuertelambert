/**
 * Visitor advice engine.
 *
 * The module turns raw readings into things a tourist can act on, in plain
 * language: what to wear, what to do, what to pack, and whether anything is
 * genuinely risky today.
 *
 * Design rules it follows:
 *  - Only triggered entries are returned, never the whole catalogue.
 *  - Rain probability is a probability: it is never phrased as a certainty.
 *  - Alerts are evaluated first and outrank ordinary advice.
 *  - No meteorological jargon in the output.
 *  - It is a pure function of (facts, copy), so the build and the live refresh
 *    in the browser always produce the same verdict.
 *
 * The thresholds below follow the brief: rain probability ≥ 60 %, air
 * temperature ≥ 32 °C, day/night spread > 8 °C, maximum ≤ 10 °C, UV ≥ 5,
 * wind force 5–6 and ≥ 7 on the Beaufort scale, dense fog.
 */

import {
  beaufort,
  lowTideWindows,
  weatherGroup,
  type CurrentFacts,
  type DayFacts,
  type MarineFacts,
} from './weather';

export interface AdviceCopy {
  groups: { outfit: string; plan: string; items: string };
  alertHeading: string;
  windForcePrefix: string;
  windForceSuffix: string;
  rules: Record<string, string>;
  items: Record<string, string>;
  alerts: Record<string, { title: string; text: string }>;
  marine: {
    title: string;
    wave: string;
    period: string;
    seaTemp: string;
    rules: Record<string, string>;
  };
  tide: {
    title: string;
    current: string;
    rising: string;
    falling: string;
    nextHigh: string;
    nextLow: string;
    high: string;
    low: string;
    range: string;
    window: string;
    windowHint: string;
    noDaylightWindow: string;
    outlook: string;
    unavailable: string;
    hourUnit: string;
    minuteUnit: string;
  };
}

export interface AdviceInput {
  current: CurrentFacts;
  today: DayFacts | null;
  marine: MarineFacts | null;
}

export interface AdviceItem {
  id: string;
  label: string;
}

export interface AdviceModel {
  alerts: { id: string; title: string; text: string }[];
  outfit: string[];
  plan: string[];
  items: AdviceItem[];
  marine: string[];
  windForce: number;
}

const STORM_CODES = new Set([95, 96, 99]);
/** Drizzle and slight rain: a folding umbrella is enough. */
const LIGHT_RAIN_CODES = new Set([51, 53, 55, 56, 57, 61]);
/** Moderate rain and above: a waterproof shell beats a long umbrella. */
const RAIN_SHELL_CODES = new Set([63, 65, 66, 67, 80, 81, 82]);
/** Genuinely severe rain, the only tier that deserves a red warning. */
const SEVERE_RAIN_CODES = new Set([65, 66, 67, 82]);
const FOG_CODES = new Set([45, 48]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);

/** How many entries each column may show before it stops being scannable. */
const MAX_OUTFIT = 3;
const MAX_PLAN = 3;
const MAX_ITEMS = 6;

export function buildAdvice(input: AdviceInput, copy: AdviceCopy): AdviceModel {
  const { current, today, marine } = input;
  const code = current.code;
  const group = weatherGroup(code);
  const rules = copy.rules;

  const alerts: AdviceModel['alerts'] = [];
  const outfit: string[] = [];
  const items: AdviceItem[] = [];
  const plan: string[] = [];
  const planCaution: string[] = [];
  const planPositive: string[] = [];
  const marineRules: string[] = [];

  const text = (id: string) => rules[id] ?? '';
  const pushUnique = (list: string[], cap: number, id: string) => {
    const value = text(id);
    if (value && list.length < cap && list.indexOf(value) === -1) list.push(value);
  };
  const pushMarine = (id: string) => {
    const value = copy.marine.rules[id] ?? rules[id] ?? '';
    if (value && marineRules.length < 4 && marineRules.indexOf(value) === -1) marineRules.push(value);
  };
  const addItem = (id: string) => {
    const label = copy.items[id];
    if (label && items.length < MAX_ITEMS && !items.some((it) => it.id === id)) {
      items.push({ id, label });
    }
  };
  const addAlert = (id: string) => {
    const entry = copy.alerts[id];
    if (entry && !alerts.some((a) => a.id === id)) alerts.push({ id, title: entry.title, text: entry.text });
  };

  // ------------------------------------------------------- derived readings
  const max = today ? today.max : current.temperature;
  const min = today ? today.min : current.temperature;
  const rainChance = today
    ? today.rainChance
    : group === 'rain' || group === 'showers'
      ? 80
      : 0;
  const precipSum = today ? today.precipSum : current.precipitation;
  const windMax = Math.max(today ? today.windMax : 0, current.wind);
  const gustMax = Math.max(today ? today.gustMax : 0, current.gust);
  const uv = today?.uv ?? null;
  const spread = max - min;
  const windForce = beaufort(windMax);

  const stormy = STORM_CODES.has(code);
  const lightRain = LIGHT_RAIN_CODES.has(code);
  const rainShell = RAIN_SHELL_CODES.has(code) || stormy || precipSum >= 10;
  const severeRain = SEVERE_RAIN_CODES.has(code) || precipSum >= 20;
  const foggy = FOG_CODES.has(code);
  const snowy = SNOW_CODES.has(code);
  const raining = lightRain || rainShell;
  const wet = rainChance >= 60 || raining || precipSum >= 1;
  const windy = windForce >= 5 || gustMax >= 50;
  const gale = windForce >= 7 || gustMax >= 70;
  const cold = max <= 10;
  const hot = max >= 32;
  const diurnal = spread > 8;
  const uvStrong = uv !== null && uv >= 5;
  const humid = current.humidity >= 80 && current.temperature >= 22;

  // ------------------------------------------------- risk (outranks the rest)
  if (stormy) addAlert('thunderstorm');
  if (severeRain) addAlert('heavyRain');
  if (gale) addAlert('windStorm');
  if (foggy) addAlert('denseFog');
  if (snowy) addAlert('snow');
  if (max >= 35) addAlert('extremeHeat');
  if (uv !== null && uv >= 11) addAlert('highUV');
  if (marine && marine.waveHeight !== null && marine.waveHeight >= 3) addAlert('roughSea');

  // ------------------------------------------------------------ what to wear
  if (wet) pushUnique(outfit, MAX_OUTFIT, 'outfit.waterproof');
  if (cold) pushUnique(outfit, MAX_OUTFIT, 'outfit.cold');
  if (hot) pushUnique(outfit, MAX_OUTFIT, 'outfit.hot');
  if (windy) pushUnique(outfit, MAX_OUTFIT, 'outfit.windproof');
  if (diurnal) pushUnique(outfit, MAX_OUTFIT, 'outfit.warmLayer');
  if (uvStrong) pushUnique(outfit, MAX_OUTFIT, 'outfit.uv');
  if (humid) pushUnique(outfit, MAX_OUTFIT, 'outfit.humid');
  if (outfit.length === 0) pushUnique(outfit, MAX_OUTFIT, 'outfit.mild');

  // ---------------------------------------------------------- what to do
  if (stormy) pushUnique(planCaution, MAX_PLAN, 'plan.storm');
  if (rainShell && !stormy) pushUnique(planCaution, MAX_PLAN, 'plan.heavyRain');
  if (gale) pushUnique(planCaution, MAX_PLAN, 'plan.wind7');
  if (rainChance >= 60 && !raining) pushUnique(planCaution, MAX_PLAN, 'plan.rainSoon');
  if (lightRain) pushUnique(planCaution, MAX_PLAN, 'plan.lightRain');
  if (foggy) pushUnique(planCaution, MAX_PLAN, 'plan.fog');
  if (hot) pushUnique(planCaution, MAX_PLAN, 'plan.heat');
  if (windForce >= 5 && windForce <= 6) pushUnique(planCaution, MAX_PLAN, 'plan.wind5');

  // The low-tide window is specific to this headland and time-sensitive, so it
  // leads the positive suggestions when the sea allows it.
  if (marine && marine.tideDays.length) {
    const windows = lowTideWindows(
      marine.tide,
      marine.tideDays[0].date,
      today?.sunrise ?? null,
      today?.sunset ?? null
    );
    const calmEnough = !stormy && !gale && (marine.waveHeight ?? 0) < 2.5;
    if (calmEnough && windows.some((window) => window.daylight)) {
      pushUnique(planPositive, MAX_PLAN, 'plan.lowTide');
    }
  }

  if (group === 'clear' || group === 'mainlyClear') pushUnique(planPositive, MAX_PLAN, 'plan.clear');
  else if (group === 'partlyCloudy' || group === 'overcast') pushUnique(planPositive, MAX_PLAN, 'plan.cloudy');
  if (windForce >= 4 || diurnal || cold) pushUnique(planPositive, MAX_PLAN, 'plan.ridgeWind');
  if (!foggy && rainChance < 60 && group !== 'overcast') pushUnique(planPositive, MAX_PLAN, 'plan.viewpoint');

  plan.push(...planCaution);
  for (const entry of planPositive) {
    if (plan.length >= MAX_PLAN) break;
    plan.push(entry);
  }

  // ------------------------------------------------------- what to bring
  if (rainShell) addItem('raincoat');
  else if (rainChance >= 60) addItem('umbrella');
  if (lightRain) addItem('foldingUmbrella');
  if (wet) addItem('nonSlipShoes');
  if (uvStrong) {
    addItem('sunscreen');
    addItem('sunglasses');
    addItem('hat');
  }
  if (max >= 28 || (uv !== null && uv >= 6)) addItem('water');
  if (cold) {
    addItem('coat');
    addItem('scarf');
  } else if (diurnal) {
    addItem('jacket');
  }
  if (windy) addItem('windbreaker');
  if (foggy) addItem('mask');

  // ------------------------------------------------------------ sea state
  if (marine && marine.waveHeight !== null) {
    const wave = marine.waveHeight;
    pushMarine(wave >= 2.5 ? 'marine.rough' : wave >= 1.5 ? 'marine.moderate' : 'marine.calm');
    if (marine.seaTemp !== null && marine.seaTemp < 15) pushMarine('marine.coldWater');
    pushMarine('marine.noSwim');
  }

  return { alerts, outfit, plan, items, marine: marineRules, windForce };
}

/** Emoji shown next to each "what to bring" entry. */
export const ITEM_EMOJI: Record<string, string> = {
  umbrella: '☂️',
  foldingUmbrella: '🌂',
  raincoat: '🧥',
  nonSlipShoes: '🥾',
  sunscreen: '🧴',
  sunglasses: '🕶️',
  hat: '🧢',
  water: '💧',
  jacket: '🧥',
  coat: '🧥',
  scarf: '🧣',
  windbreaker: '🌬️',
  mask: '😷',
};
