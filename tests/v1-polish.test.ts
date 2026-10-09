import {solarState} from '../lib/weather/solar';
import {describe,it,expect} from 'vitest';
import {pointerAttention,reactToUser,interactionAction} from '../lib/weather/interaction';
import {validPlace,recentPlaces} from '../lib/weather/preferences';
import {directWorld,DEFAULT_SIMULATION,PRESETS,interpolateWorld,initialLife} from '../lib/weather/director';
import {PLACES} from '../lib/weather/engine';
const world=(condition:string)=>directWorld(null,PLACES[0],0,{...DEFAULT_SIMULATION,...PRESETS[condition],condition:condition as typeof DEFAULT_SIMULATION.condition});
describe('Fon interaction boundaries',()=>{
 it('clamps pointer head rotation',()=>{const p=pointerAttention(100,-100,10,false,false);expect(p.x).toBe(.22);expect(p.y).toBe(.12);expect(p.until).toBe(12.5)});
 it('disables pointer tracking on touch',()=>expect(pointerAttention(1,1,10,true,false).until).toBe(0));
 it('disables pointer tracking with reduced motion',()=>expect(pointerAttention(1,1,10,false,true).until).toBe(0));
 it('keeps storm interaction protective',()=>expect(interactionAction(world('storm'))).toBe('shelter'));
 it('keeps windy interaction braced',()=>expect(interactionAction(world('wind'))).toBe('brace'));
 it('maps rain interaction to watching the rain',()=>expect(interactionAction(world('rain'))).toBe('rain-watch'));
 it('keeps hot interaction low energy',()=>expect(interactionAction(world('hot'))).toBe('rest'));
 it('keeps night interaction calm',()=>expect(interactionAction({...world('clear'),night:true})).toBe('gaze'));
 it('ignores repeated taps inside the cooldown',()=>{const state=initialLife();expect(reactToUser(state,world('clear'),12,10)).toBe(state)});
 it('allows a new reaction after cooldown',()=>expect(reactToUser(initialLife(),world('rain'),16,10).action).toBe('rain-watch'));
});
describe('world integrity',()=>{
 it('never invents snow from winter or low temperature',()=>{const w=directWorld(null,PLACES[0],0,{...DEFAULT_SIMULATION,condition:'cold',temp:-10,season:'Winter'});expect(w.snowCover).toBe(0);expect(w.snow).toBe(0)});
 for(const [from,to] of [['rain','snow'],['snow','rain']])it(`${from} to ${to} fades without simultaneous precipitation`,()=>{let a=world(from),b=world(to);for(let i=0;i<1200;i++){a=interpolateWorld(a,b,.016);expect(a.rain*a.snow).toBe(0)}expect(a.rain).toBeCloseTo(b.rain,3);expect(a.snow).toBeCloseTo(b.snow,3)});
});
describe('local location history',()=>{
 it('moves a repeat to the front without duplicates',()=>{expect(recentPlaces([PLACES[0],PLACES[1]],PLACES[1])).toEqual([PLACES[1],PLACES[0]])});
 it('keeps at most five entries',()=>expect(recentPlaces(PLACES,{name:'Paris',country:'France',latitude:48.85,longitude:2.35})).toHaveLength(5));
 it('rejects damaged local preferences',()=>{for(const p of [null,{}, {...PLACES[0],latitude:91},{...PLACES[0],longitude:Infinity}])expect(validPlace(p)).toBe(false)});
 it('accepts legitimate zero coordinates',()=>expect(validPlace({...PLACES[0],latitude:0,longitude:0})).toBe(true));
});

describe('solar phases',()=>{
 const rise=100000,set=140000;
 for(const [offset,phase] of [[-3000,'Night'],[-1800,'Pre-sunrise'],[0,'Sunrise'],[2000,'Day']] as const)it(`derives ${phase} from sunrise`,()=>expect(solarState((rise+offset)*1000,rise,set,true).phase).toBe(phase));
 for(const [offset,phase] of [[-1800,'Golden hour'],[0,'Sunset'],[1800,'Blue hour'],[4000,'Night']] as const)it(`derives ${phase} from sunset`,()=>expect(solarState((set+offset)*1000,rise,set,true).phase).toBe(phase));
 it('keeps illumination continuous at sunrise',()=>expect(Math.abs(solarState((rise-1)*1000,rise,set,true).daylight-solarState((rise+1)*1000,rise,set,true).daylight)).toBeLessThan(.001));
 it('uses provider day/night when polar sun events are absent',()=>expect(solarState(0,null,null,false).phase).toBe('Night'));
});
