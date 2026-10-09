# Canonical Fon — reference lock, 24 September 2026

The three user-supplied sheets in `docs/fon-references/` are the official appearance targets. They are preserved unchanged in source and are not downloaded by the live homepage. They supersede the temporary geometry as a design reference. Images are not a skeleton, animation or GLB.

## Identity that must not change

Rounded friendly duck, large rounded head, soft cream/white face, glossy dark eyes with restrained catchlights, broad yellow/orange bill, short orange webbed feet, vivid blue hooded expedition jacket and backpack. Preserve the recognizable silhouette, hood opening, short wings, jacket pockets/zip and backpack straps. Soft premium stylization: cloth is matte, eyes glossy, bill softly reflective; avoid metallic body materials or a realistic bird redesign.

Reference colors: Fon Blue #2563EB, Atmosphere Navy #0B1220, Cloud White #F7FAFC, Sun Yellow #FACC15. Use darker blues for hood folds and warm brown/charcoal straps. Source sheets show outfit/backpack variants; these are optional wardrobe targets, not a reason to swap the default character identity.

## Proportions and orientation

Target source asset approximately 1 metre tall, Y up, forward -Z, root at the feet. Current scene uses a 2.7-unit silhouette facing +Z. `modelFit` in `model-contract.ts` derives scale and ground offset from actual bounds and applies a 180° yaw. `FON_ASSET_CONFIG` is the single place to change conventions. Life Engine does not know model units or axes.

## Wardrobe and rig planning

Default: blue jacket + backpack. Rain: blue umbrella at suitable wind levels; yellow raincoat remains an optional authored wardrobe mesh. Cold: blue scarf/hat or winter outfit. Strong wind/storm: brace/shelter, no unsafe umbrella. Keep outfit geometry separate from the body and weight it to the same skeleton. Do not synthesize missing production clothing from claims in these sheets.

Supported canonical attachment aliases: head/Head, body/Body, back/Back/Backpack, wing-left/wing_L/Wing_L, wing-right/wing_R/Wing_R. Export explicit accessory sockets with meaningful transforms. A skeleton bone is not necessarily a correctly placed socket. Runtime accessory scale is compensated for the normalized model scale; author socket axes and check pose-specific intersections.

## Animation acceptance

Use the existing recommended clip list in FON_MODEL_CONTRACT.md. Idle: soft breathing and curious eye/head motion; walk: short deliberate steps, no root drift; sit/rest: grounded body; sleep: eyes closed and relaxed posture; rain: hood/umbrella-aware; snow: restrained play; storm: low stance and brace; gaze: cloud-watch by day, star-gaze at night. Avoid exaggerated elastic motion or human hand gestures incompatible with wings.

`selectClip` is weather-aware for play and gaze. Missing specialized clips use neutral aliases/idle rather than an unrelated seasonal action. Match the three sheets visually before calling the asset final. Optional facial morphs should be authored and mapped deliberately, not guessed from index order.

## Current implementation boundary

The procedural Fon remains TEMPORARY. Added seams, pocket flaps, warm buckles, backpack webbing, jacket hem and canonical palette are approximation detail only. They do not constitute a finished rig or approved character asset. The app can continue to run live weather and world simulations without the production model.

## Still-image fallback

`public/assets/fon-canonical-still.png` is a generated transparent isolation based on the first canonical sheet's three-quarter-front pose, used only when the 3D scene cannot render or while it loads. It was visually checked for the blue hood, pockets, cream face, orange bill/feet and backpack. It is not a GLB or an animation and does not replace the original reference sheets as the production source of truth.
