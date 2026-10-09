import {describe,it,expect} from 'vitest';
import {condition,season,timeBand,behaviorPool,nextBehavior,geoPoint,localParts,type World} from '../lib/weather/engine';
import {normalize} from '../lib/weather/provider';
const w:World={condition:'clear',band:'Day',season:'Summer',night:false,wet:false,cloud:0,wind:0,temp:20,daylight:1};
describe('weather engine',()=>{
it('prioritizes hazardous weather over heat and wind',()=>{expect(condition(95,40,80)).toBe('storm');expect(condition(65,40,80)).toBe('heavy-rain');expect(condition(73,40,80)).toBe('snow')});
it('separates hemisphere seasons and tropical climates',()=>{expect(season(51,1)).toBe('Winter');expect(season(-33,1)).toBe('Summer');expect(season(0,8)).toBe('Tropical');expect(season(51,12)).toBe('Winter')});
it('uses the location timezone across calendar boundaries',()=>{expect(localParts(Date.parse('2026-12-31T18:00:00Z'),'Asia/Tokyo')).toEqual({month:1,hour:3})});
it('derives dawn dusk and polar fallback',()=>{expect(timeBand(6000000,6000,42000,true)).toBe('Sunrise');expect(timeBand(42000000,6000,42000,true)).toBe('Golden hour');expect(timeBand(90000000,null,null,false)).toBe('Night')});
it('severe weather takes priority over sleep',()=>{expect(behaviorPool({...w,condition:'storm',night:true})).not.toContain('sleep')});
it('excludes the last two actions from choice',()=>{expect(nextBehavior(w,['look','walk'],0)).toBe('sit')});
it('maps equator and poles to the sphere',()=>{expect(geoPoint(0,0)).toEqual([1,0,-0]);expect(geoPoint(90,0)[1]).toBeCloseTo(1)});
it('rejects malformed data instead of generating weather',()=>{expect(()=>normalize({})).toThrow();expect(()=>normalize({current:{temperature_2m:null},timezone:'UTC'})).toThrow()});
it('keeps absent optional readings null',()=>{expect(normalize({current:{temperature_2m:12,time:1},timezone:'UTC'}).feels).toBeNull()});
});
