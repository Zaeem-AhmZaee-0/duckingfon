import {describe,it,expect} from 'vitest';
import {modelFit,selectClip,FON_ANCHOR_ALIASES} from '../lib/weather/model-contract';
import {directWorld,DEFAULT_SIMULATION} from '../lib/weather/director';
import {PLACES,worldState} from '../lib/weather/engine';
import {normalize} from '../lib/weather/provider';
const world=directWorld(null,PLACES[0],0,DEFAULT_SIMULATION);
describe('canonical Fon adapter',()=>{
 it('fits a one metre source and flips canonical -Z toward the camera',()=>{expect(modelFit(1,0)).toEqual({scale:2.7,offsetY:-0,yaw:Math.PI})});
 it('grounds an off-origin model without changing the Life Engine',()=>{expect(modelFit(2,-.5)).toEqual({scale:1.35,offsetY:.675,yaw:Math.PI})});
 it('rejects invalid geometry bounds',()=>{expect(()=>modelFit(0,0)).toThrow();expect(()=>modelFit(NaN,0)).toThrow()});
 it('accepts sheet wing socket names',()=>{expect(FON_ANCHOR_ALIASES['wing-right']).toContain('Wing_R')});
 it('never selects snow play for clear weather',()=>{expect(selectClip('play',['snow-play','play','idle'],world)).toBe('play')});
 it('selects snow and rain clips only in their world',()=>{expect(selectClip('play',['snow-play','rain-play','idle'],{...world,condition:'snow'})).toBe('snow-play');expect(selectClip('play',['snow-play','rain-play','idle'],{...world,condition:'rain',wet:true})).toBe('rain-play')});
 it('separates day and night gaze',()=>{const clips=['star-gaze','cloud-watch','idle'];expect(selectClip('gaze',clips,world)).toBe('cloud-watch');expect(selectClip('gaze',clips,{...world,night:true})).toBe('star-gaze')});
});
describe('live local time bands',()=>{
 const rise=Date.parse('2026-09-24T01:00:00Z')/1000,set=Date.parse('2026-09-24T13:00:00Z')/1000;
 const weather=normalize({timezone:'Asia/Karachi',current:{time:rise,temperature_2m:24,weather_code:0,is_day:1},daily:{time:[rise],sunrise:[rise],sunset:[set]}});
 it('uses selected-location morning and afternoon',()=>{expect(worldState(weather,PLACES[0],Date.parse('2026-09-24T04:00:00Z')).band).toBe('Morning');expect(worldState(weather,PLACES[0],Date.parse('2026-09-24T09:00:00Z')).band).toBe('Afternoon')});
 it('retains sunrise and sunset transitions',()=>{expect(worldState(weather,PLACES[0],rise*1000).band).toBe('Sunrise');expect(worldState(weather,PLACES[0],set*1000).band).toBe('Sunset')});
});
describe('atmosphere consistency',()=>{
 it('does not show celestial bodies through dense fog',()=>{const fog=directWorld(null,PLACES[0],0,{...DEFAULT_SIMULATION,condition:'fog',time:'Night'});expect(fog.moon).toBe(0);expect(fog.stars).toBe(0)});
 it('overcast hides direct sunlight',()=>{const overcast=directWorld(null,PLACES[0],0,{...DEFAULT_SIMULATION,condition:'cloudy',cloud:100});expect(overcast.sun).toBe(0)});
});
