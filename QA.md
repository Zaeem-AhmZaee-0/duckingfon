# V1 polish verification — 6 October 2026

This entry supersedes the older preview-availability limitation below. The preview ran successfully and was exercised through the supported browser Playwright interface.

## Changes completed

- Original supplied colored transparent logo, unchanged bytes; compact introduction and quieter forecast/navigation.
- Mobile world now follows weather content in document flow: loading messages, errors and long location names cannot push controls over Fon.
- Recent places (five), persisted graphics Auto/High/Balanced/Low, validated local saved-place data, explicit illustrated fallback language.
- Actual sunrise/sunset-based pre-sunrise, sunrise, day, golden hour, sunset, blue hour and night phases with smooth daylight strength.
- Winter no longer invents snow. Rain-to-snow changes fade the old precipitation out before introducing the new type.
- Five-second interaction cooldown, contextual hazard reactions, restrained smoothed pointer attention; touch and reduced motion disable tracking.
- Rounded shoreline geometry and closer 3D framing implemented. These changes still require GPU visual acceptance.
- Future rig adapter supports optional head bones and preserves the independent Life Engine. Canonical sheets, hoodie image and reference-only turntable remain preserved.

## Executed checks

- 106 offline tests passed; four live provider tests passed separately (Lahore, Tokyo, Sydney forecast/timezone/geocoding checks). TypeScript passed.
- Live browser: Lahore weather loaded; global Tokyo search returned disambiguated results and keyboard Enter selected Japan; Tokyo save and recent-place groups worked. Globe city selection changed to Sydney with Australia/Sydney local time and Spring season.
- Tokyo details displayed humidity, wind, pressure, precipitation, cloud, visibility, UV and provider sunrise/sunset. Hourly and seven-day forecasts loaded. Trends supplied an accessible data table.
- Dark theme, reduced motion and Low graphics persisted across reload, then were reset. Intro dismissal and dialog Escape worked. Ambience control switched on; audible quality is not certified.
- All ten weather, five time and four season selectors passed director-state checks; no simultaneous rain/snow state.
- Seven CSS iframe viewports checked: 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800. No horizontal overflow. These are CSS viewport checks, not physical-device tests. A timing timeout at 1024 was resolved by waiting for the loaded iframe.
- Visual mobile review found the location-button/Fon overlap; corrected with flow-based layout and visually rechecked. Desktop/night fallback and mobile/day fallback reviewed.
- Radar displayed the honest unavailable state. Successful radar observations were not available. 2D globe fallback showed Tokyo coordinates 35.690°, 139.692° and supported city selection.
- Latest browser errors observed were extension metadata errors, not application exceptions.

## Dependency verification

Sharp updated to 0.35.5 for the current security advisory. source-map-js 1.2.2 is available but blocked by the existing seven-day release-age policy; the policy was not weakened. Recheck after its eligibility date. Full audit findings are recorded in docs/SECURITY.md.

## Remaining acceptance limits

No final GLB exists. This browser lacks WebGL2: production rig, GPU world transitions, particles, globe drag/zoom, sustained FPS, GPU memory and render-cost acceptance remain unverified. No claim of complete 3D visual QA or final portfolio readiness. Screenshots are UI/fallback review evidence only. Browser failure injection, physical-device geolocation, screen-reader software, full contrast audit and 200% text-size testing remain outside verified evidence. Existing unit tests cover failure/stale handling.

Readiness estimate: approximately 80% of V1 overall, an engineering judgment rather than a measured score. Weather/product architecture is substantially complete; final character and GPU acceptance are material remaining work. Adapter preparation is ready, but actual drop-in compatibility cannot be guaranteed before inspecting the delivered rig. See docs/FON_MODEL_CONTRACT.md for exact replacement steps.

---

# Weather reliability revision — 5 October 2026

## Completed and verified in this revision

- Background refresh preserves the last valid reading for the same location. A failed refresh displays an explicit last-available notice and retry control. Switching locations immediately hides the previous location's readings. Reducer request IDs plus abort guards reject late success and failure responses.
- The clock catches up when the page becomes visible; stale active sessions refresh on return (at least one minute since last attempt) and reconnection. Periodic network refresh pauses while hidden.
- Hourly windows exclude an expired hour at an exact boundary. Only a reading containing the current instant receives the Now label or supplies current hourly UV/visibility. Repeated DST hours remain distinct by timestamp.
- Daily high/low, sunrise/sunset and Today labels use the selected location's calendar date. Yesterday's sunrise is no longer reused when today's daily reading is missing. Night begins consistently at the exact sunset boundary.
- Missing WMO codes use an unknown symbol, never a sun. Freezing drizzle/rain, fog and thunderstorms receive the corresponding symbols. Superseded search results are cleared while a new request is pending.
- Next and eslint-config-next upgraded to 16.3.6; compatible patched undici, fast-uri and brace-expansion overrides applied with the existing dependency policy retained.

## Executed evidence

- 79 offline unit tests passed (20 new regression checks); four opt-in network tests also passed separately using `RUN_LIVE_WEATHER=1 pnpm exec vitest run tests/live-weather.test.ts`.
- Live network tests fetched actual Open-Meteo forecasts for Lahore, Tokyo and Sydney, normalized current/hourly/daily data, checked selected timezones and grid coordinates, and exercised date/world-state selection. Actual Sydney geocoding also passed. These are provider integration tests, **not browser or deployed-route end-to-end tests**.
- TypeScript no-emit and production build passed. Existing large lazy 3D bundle and deprecated middleware warnings remain.
- Dependency audit: initially 19 advisories; after updates, 0 critical, 1 high, 0 moderate, 0 low. Remaining: braces <=3.0.3, GHSA-vfj7-8cjw-p6xm, with no published patched version at this check. Dependency paths are build/lint tooling through fast-glob/micromatch. No application feature accepts user-provided glob patterns. This is not a clean audit or a general security certification.
- A targeted secret-pattern scan of app/components/lib/scripts found no matches; `.env*` remains ignored.

## Current verification limits

The supervised preview reports running, but the preview HTTP endpoint returned 502 connection refused. The required control-browser skill is unavailable in this session. No fresh browser interaction, responsive screenshot, visual QA or GPU performance result is claimed. Prior September browser observations below remain dated evidence only. This session's screenshots were not used for a portfolio claim.

Final production Fon GLB/rig/clips are still absent. The canonical reference sheets, temporary proxy, replaceable model adapter and model contract remain intact. Final rig acceptance and WebGL visual/performance acceptance remain outstanding.

References: https://github.com/advisories/GHSA-vcvr-r3jv-pc5j and https://github.com/advisories/GHSA-vfj7-8cjw-p6xm.

---

# Canonical-reference refinement — 24 September 2026

This revision preserves all three official reference sheets unchanged in `docs/fon-references/` and documents their precedence in `docs/FON_CANONICAL_REFERENCE.md`. The current 3D duck remains a temporary procedural proxy. A reference-guided transparent still image replaces the previous cropped portrait only in the non-WebGL/loading fallback.

Implemented since the report below: automatic GLB bounds fitting, canonical -Z-to-scene +Z orientation conversion, canonical socket aliases, accessory scale compensation, weather-aware play/gaze clip selection, blue jacket/pocket/buckle/backpack detail on the proxy, layered terrain ridgelines, instanced ground details, wind-directed rain streaks, softer tone-mapped lighting and unified sky/page colors. Fully overcast conditions hide direct sun; fog hides celestial bodies. Live time bands distinguish Morning and Afternoon in the selected timezone. Interface chrome is quieter and primary touch controls have 44px minimum targets.

Verification for this revision: **59 unit tests passed**, including model scale/grounding, socket aliases, correct seasonal clips, local-time bands and fog/cloud consistency. TypeScript and production build passed. Live Lahore and London weather, global search, location switch, saved London, hourly/daily forecasts and ten Scene Lab states were exercised in the actual preview. Lahore showed sunrise 05:51, sunset 17:56, humidity 86%, wind 4.6 km/h, pressure 1006.5 hPa, visibility 6.5 km and UV 0 during inspection. London showed 18:28 local time and Golden hour while Lahore was at night. These are observed live values, not fixed fixtures.

Desktop and mobile fallback compositions were visually inspected. All seven requested CSS viewport sizes were checked without horizontal overflow; smaller screens may scroll vertically. **WebGL2 is still unavailable in the provided browser**, so the new 3D terrain, rain and lighting are implemented/typechecked, not visually certified. No final-rig or GPU performance acceptance is claimed. The 1.2 MB still image is smaller than the previous 2.8 MB reference-sheet image used for the fallback. The original canonical sheets are stored as documentation and are not served/downloaded by the homepage. No dependencies changed in this revision; the prior audit result below is dated, not a new audit claim.

The final character replacement instructions in FON_MODEL_CONTRACT.md and FON_CANONICAL_REFERENCE.md supersede the older +Z/2.7 source-export convention below. Export approximately 1 metre, Y-up/-Z-forward; the adapter handles scene scale/orientation. Uncompressed standard GLB is supported; Draco/KTX2 requires configured decoders.

---

# DuckingFon verification — 23 September 2026

## Status

Substantial functional implementation completed with a clearly temporary Fon proxy. Live weather was exercised in the running local application, not inferred from source. This is **not final production visual certification**. The available browser disables WebGL2; actual 3D visuals, sustained GPU performance and final rig integration remain unverified. No final portfolio images or performance scores were fabricated.

## Completed implementation

- Real current/hourly/daily weather and global city search; selected-location coordinates/timezone/local clock; sunrise/sunset; humidity, wind, pressure, precipitation, cloud cover; hourly UV and visibility labelled as such.
- Abortable, debounced requests, safe loading/error/retry states, stale-response guards, public-provider failover after server/network failure. Missing readings stay unavailable.
- World Director with ten condition mappings, time/season targets, rain/snow exclusivity, lighting/fog/cloud/wetness/snow-cover/audio targets and smooth interpolation.
- Development-only Scene Lab: ten weather presets, five times, four seasons and four scalar sliders; visibly simulated readings and behavior state. Production routes reject both labs.
- Separate weighted Life Engine, priorities, timed action changes, recent-action avoidance, interrupts, weather/time mapping. Proxy demonstrates restrained breathing/look/blink/rest/sleep/walk/play/shiver/brace transforms. These are not final skeletal animations.
- Rig adapter with GLTF loader, skeleton clone, clip aliases, AnimationMixer blending, fallback boundary and named accessory attachments. Life Engine stays unchanged when the model is swapped.
- Responsive weather UI, saved places, C/F, themes, reduced motion, explicit sound and location controls. No authentication introduced.
- Geographically positioned globe markers, rotation/zoom code, Earth lighting and 2D map fallback. Radar uses provider observations or an explicit unavailable state; charts include a text table and preserve gaps for missing temperatures.
- HIGH/MEDIUM/LOW/STATIC tiers; reduced DPR/particles/shadows, hidden-tab pausing, lazy 3D/exploration/Leaflet, FPS/render resource instrumentation with adaptive downgrades.
- Input/query bounds, safe errors, timeouts, response headers, isolate-local request throttle, no credentialed permissive CORS; no app secrets needed.

## Executed checks and results

| Check | Evidence / result |
| --- | --- |
| Unit suite | 48 passing Vitest tests: WMO mapping, timezone boundaries, hemisphere/tropical seasons, dawn/dusk/polar handling, geographic conversion, missing values, director presets/interpolation, behavior weights/cooldowns/interrupts, animation fallbacks, input ranges, request size, throttling, provider failover, aborts and network failure. |
| TypeScript | No-emit typecheck passed. |
| Production build | Passed after security dependency upgrades; final packaging repeats build. Large lazy Three/Fiber chunk warning remains; no build failure. |
| Dependency audit | pnpm audit: 0 low, 0 moderate, 0 high, 0 critical after upgrades/overrides. Initial audit had 36 advisories. This is a point-in-time result, not a security guarantee. |
| Secret pattern scan | No hardcoded credential/private-key matches in app/components/lib/scripts. `.env*` and private keys ignored. |
| Live weather | Lahore, Sydney and Tokyo loaded actual current/hourly/daily data in Chromium. Tokyo details showed pressure 1015.5 hPa, humidity 99%, wind 3.5 km/h, visibility 19.1 km, UV 0, sunrise 05:30 and sunset 17:35 during the run. Values are observations, not permanent expected fixtures. |
| Global search/keyboard | Real Tokyo and Sydney result lists; Enter selected Tokyo. Tokyo globe fallback reported 35.690°, 139.692°; Sydney -33.868°, 151.207°. |
| Product | Intro dismissal, hourly/daily switching, save place, saved-place dialog, dark theme, reduced motion, Escape dialog dismissal passed. Dark theme, saved Tokyo and reduced motion survived reload after fixing persistence. |
| Location fallback | Explicit location request returned unavailable in this browser; the UI offered manual city search. Successful device geolocation was not available to verify. |
| Scene Lab | All 10 weather, 5 time and 4 season selectors changed the director readout through browser interaction. Rain/snow exclusivity passed; night flag followed time. Keyboard slider interaction worked after naming slider thumbs. |
| Responsive | Exact-size iframe CSS viewport checks at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800 found no horizontal page overflow. Some shorter screens scroll vertically. This is CSS layout testing, not physical-device emulation. |
| Visual inspection | Desktop and 390px fallback screenshots reviewed. Fixed off-screen mobile Fon, night backdrop, label overlap, night icon, logo blending and small-screen spacing. Only fallback visuals are certified by these screenshots. |
| Radar | Actual local request returned unavailable; the running dialog showed a clear unavailable message, with no fake observations. Base-map errors are handled separately. Successful radar tiles were not verified. |
| Globe fallback | Real Earth image and selected-coordinate marker displayed. 3D globe interaction requires WebGL-capable verification. |
| Browser console | No observed application runtime exception after fixes. Browser extension injected HTML attributes caused a hydration warning; extension metadata errors also remain outside app control. No warning suppression added. |

## Failures found and fixed

1. Preview server weather fetch failed: added real public Open-Meteo fallback, preserving aborts and refusing to bypass 4xx limits.
2. WebGL unavailable: capability gate prevents renderer initialization errors; weather stays usable with a clearly labelled still world.
3. Reduced motion reset on reload: delayed preference writes until stored preferences have loaded, then retested successfully.
4. Unlabelled slider thumbs: forwarded accessible labels to focusable slider controls.
5. Static demo readings disagreed with selected presets: simulated values now follow controls, with unsupported details left null.
6. Mobile portrait/night backdrop/label overlap and night sun icon: corrected and inspected.
7. Accessory portal signature type error: corrected to the installed React Three Fiber API; typecheck passed.
8. Dependency audit advisories: upgraded React/RSC/Vite and vulnerable transitive dependencies; audit became clean and tests/build passed.

## Measured performance scope

Pre-final-build measured largest client chunk: lazy Three/Fiber 894,932 bytes minified / 232,805 gzip. WeatherApp 132,817 / 43,533 gzip; Leaflet 148,829 / 42,783 gzip. Final chunk hashes/sizes may change slightly with final UI fixes. Source artwork is approximately 2.8 MB, logo 133 KB, Earth 501 KB; there is no GLB to measure. These are file sizes, not measured page transfer totals.

Runtime tier limits: HIGH DPR 1.7/650 rain particles/1024 shadows; MEDIUM 1.3/330/512; LOW 1/100/shadows off; STATIC no WebGL. Snow counts are 55% of rain counts. Render metrics collect FPS, draw calls, triangles, geometry/texture counts. GPU FPS, heap/GPU memory, network timing, device temperature and power consumption could not be measured in this non-WebGL browser. No Lighthouse or frame-rate claim is made.

## Exact remaining blockers and limitations

- **Asset blocker:** final production Fon GLB/rig/animation clips have not been supplied. Adapter and documented contract are ready; actual scale, clip blending, rig anchors and production animation cannot be accepted without the file.
- **Verification limitation:** available Chromium disables WebGL2 and exposes no second engine or device hardware emulation. 3D weather differentiation, transition quality, globe rotation/zoom, actual FPS/memory and context-loss recovery still need a graphics-enabled browser. These features are implemented, not visually certified here.
- **Provider limitation observed:** local Worker provider requests failed. Weather/search succeeded end-to-end through public failover; radar remained honestly unavailable. Deployed Worker connectivity and successful radar delivery are not claimed.
- Screen-reader software audit, physical mobile devices, 200% text zoom and full contrast certification remain unverified. Named controls, semantics, keyboard search/dialog handling and textual weather equivalents were checked, but are not a WCAG certification.
- Failure and abort cases are unit-tested; browser network interception was not available, so no full offline-browser recovery claim is made. Browser checks use the supported Playwright interface; an independent CI Playwright runner is not installed.
- Global edge rate limiting and strict nonce-based CSP are future deployment hardening; the current limiter is per isolate. Provider commercial terms/imagery licensing need review before commercial launch.

## Replacing Fon

1. Export Y-up, -Z-forward, feet at Y=0, approximately 1 metre tall; the adapter fits the model to 2.7 scene units.
2. Save to `public/models/fon/Fon.glb`.
3. Match clips via `FON_CLIPS` in `lib/weather/model-contract.ts`.
4. Provide `head`, `body`, `back`, `wing-left`, `wing-right` anchors; list built-in gear in root extras `builtInAccessories` to avoid duplication.
5. Set `USE_PRODUCTION_FON=true` in `components/weather/FonModelAdapter.tsx`.
6. Run Scene Lab on a WebGL2 device, inspect all clips/accessories/transitions/reduced-motion, run tests/build, and measure mobile performance. No Life Engine rewrite is required.

See `docs/FON_MODEL_CONTRACT.md` for the full exporter/animation contract and `docs/PORTFOLIO_OUTLINE.md` for the evidence-based case study outline. Final portfolio screenshot capture is intentionally deferred until GPU visual QA passes.
