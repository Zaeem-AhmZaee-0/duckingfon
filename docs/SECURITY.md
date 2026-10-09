# Security and privacy notes

No authentication, accounts, application database, advertising scripts, or secret provider keys. Device-local preferences and saved places can be erased through browser site data; each saved place can be removed in the UI.

Weather routes enforce finite coordinate ranges, bounded query/URL lengths, GET-only behavior, request body rejection, timeouts and safe errors. A best-effort isolate-local 90 requests/minute throttle protects app endpoints; it is not a globally coordinated limiter. Provider limits still apply to public client failover. A 4xx response, including a throttle response, does not trigger failover.

App API responses do not grant cross-origin access. The public fallback uses Open-Meteo's supported public API; it has no credentials. Radar hosts/paths are validated against RainViewer. Visible provider attributions remain.

Response headers: nosniff, strict-origin referrer policy, no camera/microphone permissions, same-origin location permission. No permissive credentialed CORS. A strict CSP is not claimed; the framework uses inline hydration and should receive a nonce-aware policy before a high-risk deployment.

Location is requested only by explicit user action. Coordinates are sent to Open-Meteo to retrieve weather. Map/tile providers receive requests for the viewed area. No automatic geolocation or location history storage. Saved cities are local-only.

.env files and private keys are ignored by git. Never place secrets in public/, client modules, browser storage, or source-controlled environment files.


## Audit update — 5 October 2026

Updated Next/eslint-config-next to 16.3.6 and compatible undici/fast-uri/brace-expansion overrides. Audit now reports one high-severity advisory in build/lint dependency braces 3.0.3 (GHSA-vfj7-8cjw-p6xm); no patched version was available. Do not feed untrusted glob patterns into build tooling. No runtime user feature accepts glob patterns. Recheck the upstream fix before release; do not describe this dependency audit as clean. Next/og ImageResponse is not used by this application, but the patched Next dependency is retained.

## Audit update — 6 October 2026

The production audit found newly reported advisories in source-map-js and sharp. Upgraded sharp to 0.35.5 using the existing override policy. The source-map-js 1.2.2 fix was rejected by the project's seven-day minimum-release-age supply-chain policy (published 30 September); that policy was preserved. This patch remains outstanding until the approved release age is reached. The earlier braces tooling advisory remains part of the full audit history. Do not describe the dependency audit as clean.
