import { clamp, lerp, mix } from "./math.js";
import { solarState } from "./solar.js";

export const SEASONS = {
  spring: { warmth:.12, saturation:1.02, wind:.34, vegetation:.76, motion:.9 },
  summer: { warmth:.28, saturation:1.08, wind:.22, vegetation:1.0, motion:.82 },
  autumn: { warmth:-.02, saturation:.96, wind:.48, vegetation:.52, motion:1.05 },
  winter: { warmth:-.28, saturation:.86, wind:.18, vegetation:.18, motion:.48 }
};

export const WEATHER = {
  clear: { light:1, haze:.05, cloud:.08, rain:0, snow:0, wind:1 },
  rain:  { light:.62, haze:.34, cloud:.82, rain:1, snow:0, wind:1.18 },
  fog:   { light:.72, haze:.82, cloud:.5, rain:0, snow:0, wind:.55 },
  snow:  { light:.76, haze:.42, cloud:.68, rain:0, snow:1, wind:.72 }
};

export function createWorld(state, hour, viewport) {
  const season = SEASONS[state.season] || SEASONS.summer;
  const weather = WEATHER[state.weather] || WEATHER.clear;
  const solar = solarState(hour);

  const lowLight = lerp(.38, 1, solar.daylight);
  const weatherLight = weather.light;
  const atmosphericLight = clamp(lowLight * weatherLight);

  const paletteBias = season.warmth;
  const skyTop = mix([9,12,27], [83,151,215], clamp(.25 + solar.daylight*.75));
  const skyBottom = mix([24,28,48], [226,223,210], clamp(.12 + solar.daylight*.88));

  return {
    viewport,
    hour,
    solar,
    season,
    weather,
    light: atmosphericLight,
    haze: clamp(weather.haze + solar.night*.08),
    cloud: weather.cloud,
    wind: weather.wind * season.wind,
    vegetation: season.vegetation,
    motion: season.motion,
    paletteBias,
    skyTop,
    skyBottom,
    temperatureVisual: weather === WEATHER.snow ? "cold" : solar.phase
  };
}
