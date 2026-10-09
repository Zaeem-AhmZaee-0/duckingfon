import type {Action,World} from './engine';
export const FON_MODEL_PATH='/models/fon/Fon.glb';
export const FON_CLIPS:Record<Action,string[]>={look:['idle-look-left','idle-look-right','idle'],sit:['sit','idle'],walk:['walk','idle'],stretch:['stretch','idle'],sleep:['sleep','sit','idle'],gaze:['star-gaze','cloud-watch','sit-look-up','idle'],shiver:['shiver','warm-hands','idle'],brace:['wind-brace','storm-react','idle'],shelter:['storm-react','umbrella-idle','idle'],'rain-watch':['rain-react','umbrella-idle','idle'],play:['snow-play','rain-play','play','idle'],rest:['hot-tired','sit','idle']};
export const FON_ATTACHMENTS=['head','body','back','wing-left','wing-right'] as const;
export function selectClip(action:Action,available:string[],world?:World){const aliases=action==='play'&&world?(world.condition==='snow'?['snow-play','play','idle']:world.wet?['rain-play','play','idle']:['play','idle']):action==='gaze'&&world?(world.night?['star-gaze','sit-look-up','idle']:['cloud-watch','sit-look-up','idle']):FON_CLIPS[action];return aliases.find(name=>available.includes(name))??available.find(name=>name==='idle')??null}

/** Canonical sheets use Y-up, -Z forward, approximately one metre tall. */
export const FON_ASSET_CONFIG={sourceForward:'-Z' as '-Z'|'+Z',sceneHeight:2.7,groundY:.4};
export const FON_ANCHOR_ALIASES={head:['head','Head'],body:['body','Body'],back:['back','Back','Backpack'], 'wing-left':['wing-left','wing_L','Wing_L'],'wing-right':['wing-right','wing_R','Wing_R']} as const;
export const FON_PALETTE={jacket:'#2563eb',hoodShadow:'#153f9e',face:'#f7fafc',bill:'#facc15',billShade:'#ed9a16',backpack:'#123568',straps:'#493e31'};
export function modelFit(height:number,minY:number){if(!Number.isFinite(height)||height<=0||!Number.isFinite(minY))throw Error('Invalid Fon model bounds');const scale=FON_ASSET_CONFIG.sceneHeight/height;return {scale,offsetY:-minY*scale,yaw:FON_ASSET_CONFIG.sourceForward==='-Z'?Math.PI:0}}

export const FON_HEAD_BONES=['Head','head_bone','mixamorigHead'];
export const FON_TRANSITION_CLIPS={sleep:['sit','yawn','sleep'],wake:['wake','stand-up','idle'],play:['small-hop','play']} as const;
