# DuckingFon

Weather brought to life: live forecasts and a weather-driven world with a **temporary procedural Fon proxy**. No production rig is included or represented as finished.

## Architecture

React 19, TypeScript, Vinext/Vite, Three.js/React Three Fiber, shadcn/Radix, Leaflet, Vitest. API handlers target the existing Sites Worker runtime, not an additional Express service.

- `lib/weather/provider.ts`: real Open-Meteo normalization; absent optional values remain null.
- `lib/weather/client.ts`: bounded public-provider failover and abort handling. No synthetic live fallback; no failover on 4xx/rate limits.
- `lib/weather/engine.ts`: WMO condition mapping, selected-location timezone, sunrise/sunset, hemisphere seasons and geographic conversion.
- `lib/weather/director.ts`: shared world targets, smooth numeric interpolation, independent weighted Life Engine, priorities, cooldowns, interrupts and accessory intent.
- `components/weather/WorldView.tsx`: capability check; lazy-loads the 3D world only when WebGL2 is available.
- `WorldScene.tsx`: sky, ground, clouds, rain/snow, fog, celestial bodies, lighting, quality tiers and runtime render metrics.
- `FonModelAdapter.tsx`, `FonProxy.tsx`, `FonAccessories.tsx`: replaceable rig/animation boundary, temporary transforms, named attachment support.
- `useAtmosphereAudio.ts`: opt-in synthesized rain/wind/night ambience with gain ramps and hidden-tab suspension.
- `WeatherApp.tsx`: forecast, search, settings, local saved places, request cancellation, explicit location permission.
- `Explore.tsx`: lazy-loaded globe, radar and trends; exact-value table accompanies charts.

## Run and verify

Install with `scripts/install-pnpm.sh`; respect pnpm-workspace.yaml supply-chain policy. In the managed workspace use `sites-preview start "$PWD"` and its supervised URL. Outside that workspace use `pnpm dev`.

```
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm audit
pnpm build
```

`tests/browser-checks.mjs` contains reusable checks for the supported browser tool's Playwright surface. It is not a separately installed Playwright CI runner. `QA.md` records the actual checks and limitations.

## Development controls

`/scene-lab` exposes ten weather states, five times, four seasons, temperature, wind, precipitation and cloud sliders, with a director/action readout. All readings are explicitly simulated. `/viewport-lab?w=390&h=844` embeds the app at exact CSS viewport dimensions for layout checks. Both routes reject production access. The live homepage never uses the development fixture.

## Final character

The Life Engine is independent of the character renderer. See `docs/FON_MODEL_CONTRACT.md` for exact export, clip, anchor and replacement instructions, and `docs/FON_CANONICAL_REFERENCE.md` for the official appearance lock. The adapter normalizes model bounds and source orientation; the Life Engine remains independent. Put the final rig at `public/models/fon/Fon.glb`, configure its clip aliases and anchors, then switch `USE_PRODUCTION_FON` to true. The adapter uses a cloned skeleton, AnimationMixer cross-fades and proxy fallback. Final asset integration requires real model/GPU QA.

## Providers and attribution

- Open-Meteo weather: https://open-meteo.com/en/docs
- Open-Meteo geocoding: https://open-meteo.com/en/docs/geocoding-api
- RainViewer: https://www.rainviewer.com/api/weather-maps-api.html — past observations only, maximum zoom 7, Universal Blue scheme; honest unavailable state. The current free service is for personal/educational use; review terms before commercial launch.
- OpenStreetMap: https://www.openstreetmap.org/copyright and https://operations.osmfoundation.org/policies/tiles/ — no bulk downloads or offline tile caching.
- Earth: https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg — static imagery, not live clouds. Confirm upstream image licensing for commercial distribution.
- Logo and Fon artwork: user supplied, unchanged, presented with CSS crops.

No provider keys are needed for this configuration. A paid weather plan requires a server-side customer endpoint/key; do not expose it through public client fallback. Provider attribution is visible.

## Privacy and boundaries

No authentication, accounts, ads, analytics SDKs or application database. Preferences/saved places stay in localStorage. Users can remove saved places or clear browser site data. Sound starts muted and requires a gesture. Location permission is requested only by the location button; manual city search remains available. Coordinate requests reach the weather provider, and map-area requests reach map/radar providers.

See `docs/SECURITY.md`, `docs/FON_MODEL_CONTRACT.md`, `docs/PORTFOLIO_OUTLINE.md` and `QA.md`. This implementation is not a claim of production cinematic quality, measured mobile GPU performance or completed final-rig validation.
