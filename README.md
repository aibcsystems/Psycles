# Still — Atmosphere Engine v0.2

Phase 0 software prototype for Still: an ambient window to time.

## What changed from v0.1

- World model separated from rendering.
- Solar position and daylight phases are explicit.
- Weather changes atmospheric state, not just particles.
- Seasons affect behavior as well as palette.
- Horizon is a first-class exhibition.
- Forest is retained as a second exhibition.
- Studio controls remain available for authoring/testing.
- Display mode hides the UI.
- No external dependencies; runs as a static site.

## Run

Open `index.html` directly, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Phase 0.2 scope

This is intentionally still a browser prototype. Real weather APIs, location, moon phase, persistence, analytics, and hardware rendering are intentionally deferred.
