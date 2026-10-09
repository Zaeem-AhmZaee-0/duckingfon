# Fon model and animation contract

The current duck is **TEMPORARY PROCEDURAL PROXY GEOMETRY**. Its transforms demonstrate behavior intent, not final production animation.

## Drop-in location and switch

1. Export the final rig as `public/models/fon/Fon.glb` (served at `/models/fon/Fon.glb`).
2. Check scale and orientation below and validate the file in Scene Lab.
3. Set `USE_PRODUCTION_FON=true` in `components/weather/FonModelAdapter.tsx`.
4. Add clip aliases to `FON_CLIPS` in `lib/weather/model-contract.ts` if the delivered clips use other names.
5. Test all weather/time/season presets. Life Engine and WeatherApp require **no rewrites**.

## Coordinates and geometry

- Canonical source: Y up; character faces -Z; approximately 1 metre tall. Feet rest at local Y=0. The adapter rotates to the scene-facing +Z convention.
- The adapter normalizes actual model bounds to 2.7 scene units and grounds the feet. Apply exporter transforms and configure FON_ASSET_CONFIG only if the delivered conventions differ.
- One character root; skinned skeleton beneath it. No embedded camera or scene lighting.
- Use physically based materials for blue jacket/hood, white face/body, yellow bill/feet, eyes, backpack. Avoid unlit skin materials and external textures with broken URLs.
- Start with a mobile geometry budget of approximately 30k–60k triangles, up to 2K textures; measure rather than treating these as guaranteed safe budgets.
- Preserve user-supplied character silhouette and facial proportions.

## Skeleton and animation

Include animation clips where possible:

`idle`, `idle-look-left`, `idle-look-right`, `blink`, `sit`, `sit-look-up`, `walk`, `run`, `play`, `jump`, `stretch`, `yawn`, `sleep`, `wake`, `shiver`, `warm-hands`, `hot-tired`, `wind-brace`, `rain-react`, `umbrella-idle`, `rain-play`, `snow-play`, `storm-react`, `cloud-watch`, `star-gaze`.

Loop locomotion and idle clips without root drift. Keep root motion in-place unless a later navigation controller explicitly consumes it. A clip should blend cleanly from idle. Optional facial morphs: blinkLeft, blinkRight, smile, sleepy; absence must not prevent rendering.

## Runtime adapter

`useFonLife` evaluates the independent pure Life Engine (`stepLife`) and supplies an `Action`. The adapter receives `world`, `action`, `still`, and `onInteract`. It clones the loaded skeleton, owns an AnimationMixer, cross-fades clips, pauses animation under reduced motion, and releases mixer bindings on unmount.

Selection order is defined in `FON_CLIPS`. Missing action clips fall back to a supported alias then `idle`. If there is no appropriate clip, remain in the model's existing static pose; never throw or replay an unrelated action. Suspense uses the proxy while loading. Model errors must be caught by the model boundary, falling back to the proxy.

## Accessory attachments

Provide named nodes `head`, `body`, `back`, `wing-left`, `wing-right` with meaningful local axes and transforms. `accessories(world)` exposes accessory intent separately from the rig. Default hood belongs to the model; scarf attaches to body; umbrella attaches to a wing when wind is suitable. Set the model root GLTF extras `builtInAccessories` to an array such as `["scarf"]` to suppress duplicate runtime accessories. `FonAccessories` portals accessory geometry into named rig nodes and eases visibility through scale. Set the body anchor at the neck for the scarf, with Y up; set wing-right at the umbrella grip, with Y along the pole. When an anchor is missing, skip that accessory and retain the base model. The proxy exposes these same named attachment positions.

## Acceptance test

Confirm geometry orientation, grounded feet, model scale, materials, each clip/alias, cross-fades, no accumulated root drift, accessory anchors, reduced-motion pose, late load/error behavior, WebGL loss fallback, mobile memory and sustained frame rate. Capture final portfolio imagery only after these checks on a graphics-enabled device.

Canonical appearance, color and wardrobe rules: see FON_CANONICAL_REFERENCE.md and the unchanged source sheets in fon-references/. Plain GLB with embedded standard textures is supported; compressed Draco/KTX2 delivery requires explicitly adding and configuring decoders before switching the production model on.

## Reference assets and interaction

The supplied hoodie still and 4-second turntable are preserved under `docs/fon-references/04-hoodie.png` and `05-turntable.mp4`. The video is an appearance reference only: it contains no mesh, skeleton or animation clips and is never used as an interactive model. Preserve the blue hood/jacket, cream face, yellow-orange bill, backpack and rounded silhouette.

Optional head tracking uses an actual bone named `Head`, `head_bone` or `mixamorigHead`. Add the delivered bone name to `FON_HEAD_BONES` if necessary. It applies a restrained additive rotation after the mixer, restores the original pose every frame, and disables tracking for touch and reduced motion. Accessory anchors are separate from head bones.

`FON_TRANSITION_CLIPS` documents desired sleep/wake/play sequences; it is a delivery plan, not a sequencer. The current adapter cross-fades action clips. Validate and implement one-shot sequencing against the delivered rig before claiming final sleep/wake animation. Tap reactions have a five-second cooldown and preserve storm, cold, heat and wind priorities.
