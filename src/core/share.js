const VALID = {
  exhibition: ["horizon", "forest"],
  weather: ["clear", "rain", "fog", "snow"],
  season: ["spring", "summer", "autumn", "winter"],
  mode: ["live", "manual"]
};

// Serializes the shareable subset of studio state into a compact query
// string suitable for a URL hash. Time is only encoded in Studio (manual)
// mode — in Live mode the whole point is "now", so baking in a timestamp
// would make shared links stale on arrival.
export function encodeState(state) {
  const params = new URLSearchParams();
  params.set("ex", state.exhibition);
  params.set("wx", state.weather);
  params.set("sx", state.season);
  params.set("mode", state.mode);
  if (state.mode === "manual") {
    params.set("t", state.timeOfDay.toFixed(2));
  }
  return params.toString();
}

// Reads location.hash and returns only well-formed, whitelisted values.
// Returns null if there's nothing usable, so callers can fall back to
// defaults without any extra branching.
export function decodeState() {
  if (!location.hash || location.hash.length < 2) return null;

  const params = new URLSearchParams(location.hash.slice(1));
  const out = {};

  const ex = params.get("ex");
  if (VALID.exhibition.includes(ex)) out.exhibition = ex;

  const wx = params.get("wx");
  if (VALID.weather.includes(wx)) out.weather = wx;

  const sx = params.get("sx");
  if (VALID.season.includes(sx)) out.season = sx;

  const mode = params.get("mode");
  if (VALID.mode.includes(mode)) out.mode = mode;

  const t = parseFloat(params.get("t"));
  if (Number.isFinite(t)) out.timeOfDay = t;

  return Object.keys(out).length ? out : null;
}

// Writes state to the URL without pushing a new history entry, so
// dragging the time slider doesn't spam browser back/forward history.
export function persistState(state) {
  history.replaceState(null, "", "#" + encodeState(state));
}
