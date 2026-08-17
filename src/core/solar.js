import { clamp, lerp, smoothstep, wrap24 } from "./math.js";

export function solarState(hour) {
  const t = wrap24(hour);
  const sunrise = 6.15;
  const sunset = 18.85;
  const day = clamp((t-sunrise)/(sunset-sunrise));
  const altitude = Math.sin(day*Math.PI);
  const dawn = smoothstep(5.0, 7.0, t) * (1-smoothstep(18.0,20.5,t));
  const night = 1 - smoothstep(4.8, 6.6, t) + smoothstep(18.7, 20.8, t);
  const daylight = clamp(altitude);
  const phase =
    t < 5.0 ? "night" :
    t < 6.8 ? "dawn" :
    t < 11.0 ? "morning" :
    t < 15.5 ? "noon" :
    t < 18.8 ? "golden hour" :
    t < 20.8 ? "blue hour" : "night";

  const sunX = lerp(-0.08, 1.08, day);
  const sunY = 0.72 - altitude*0.58;

  return {
    hour:t, sunrise, sunset, altitude,
    daylight, dawn:clamp(dawn), night:clamp(night),
    phase, sunX, sunY,
    isDay: daylight > 0.015
  };
}
