import {describe,it,expect,vi,afterEach} from 'vitest';
import {directWorld,DEFAULT_SIMULATION,PRESETS,interpolateWorld,initialLife,stepLife,weightedActions,accessories} from '../lib/weather/director';
import {PLACES,type Condition} from '../lib/weather/engine';
import {normalize} from '../lib/weather/provider';
import {coordinates,guard} from '../lib/weather/security';
import {selectClip} from '../lib/weather/model-contract';
import {loadWeather,searchPlaces} from '../lib/weather/client';
const sim=(condition:Condition)=>({...DEFAULT_SIMULATION,...PRESETS[condition],condition});
const world=(c:Condition)=>directWorld(null,PLACES[0],Date.now(),sim(c));
afterEach(()=>vi.unstubAllGlobals());
describe('world director',()=>{
for(const c of Object.keys(PRESETS) as Condition[])it(`maps ${c} without conflicting precipitation`,()=>{const w=world(c);expect(w.condition).toBe(c);expect(w.rain*w.snow).toBe(0);expect(w.sun*w.moon).toBe(0);expect(w.fog).toBeGreaterThan(0);if(c==='snow'){expect(w.temp).toBeLessThanOrEqual(1);expect(w.snow).toBeGreaterThan(0);expect(w.wetness).toBe(0)}if(c==='storm'){expect(w.cloud).toBeGreaterThanOrEqual(.85);expect(w.rain).toBeGreaterThan(.5)}});
for(const time of ['Sunrise','Morning','Afternoon','Sunset','Night'] as const)it(`maps ${time}`,()=>{const w=directWorld(null,PLACES[0],0,{...sim('clear'),time});expect(w.night).toBe(time==='Night');expect(w.simulated).toBe(true)});
it('interpolates rather than jumping and converges',()=>{let from=world('clear'),to=world('heavy-rain');const once=interpolateWorld(from,to,.016);expect(once.rain).toBeGreaterThan(0);expect(once.rain).toBeLessThan(to.rain);for(let i=0;i<1000;i++)from=interpolateWorld(from,to,.016);expect(from.rain).toBeCloseTo(to.rain,3)});
it('marks real world as non-simulated',()=>expect(directWorld(null,PLACES[0],0).simulated).toBe(false));
});
describe('life engine',()=>{
it('holds a behavior until its cooldown expires',()=>{const s=stepLife(initialLife(),world('clear'),30,.2);expect(stepLife(s,world('clear'),31,.9)).toBe(s)});
it('interrupts sleep immediately for storms',()=>{const s={...initialLife(),action:'sleep' as const,until:100,severity:1};expect(['shelter','brace','look']).toContain(stepLife(s,world('storm'),20,.1).action)});
it('avoids immediately repeating an action',()=>{let s=stepLife(initialLife(),world('rain'),30,.1);const old=s.action;s=stepLife(s,world('rain'),100,.1);expect(s.action).not.toBe(old)});
it('uses nonuniform weights',()=>{const pool=weightedActions(world('hot'));expect(pool[0][1]).toBeGreaterThan(pool[2][1])});
it('maps missing animation to idle',()=>{expect(selectClip('sleep',['walk','idle'])).toBe('idle');expect(selectClip('sleep',['walk'])).toBeNull()});
it('provides cold-weather accessory intent',()=>expect(accessories(world('cold'))).toContain('scarf'));
});
describe('normalization and input boundary',()=>{
it('does not invent missing visibility or UV',()=>{const w=normalize({timezone:'UTC',current:{time:1,temperature_2m:2},hourly:{time:[1]}});expect(w.hourly[0].visibility).toBeNull();expect(w.hourly[0].uv).toBeNull()});
for(const q of ['lat=&lon=0','lat=91&lon=0','lat=0&lon=181','lat=NaN&lon=2','lon=3'])it(`rejects ${q}`,()=>expect(coordinates(new URL('https://test/?'+q))).toBeNull());
it('accepts zero coordinates',()=>expect(coordinates(new URL('https://test/?lat=0&lon=0'))).toEqual({latitude:0,longitude:0}));
it('rejects oversized request URLs',()=>expect(guard(new Request('https://test/?q='+'a'.repeat(1100)))?.status).toBe(414));
});
describe('request failover and cancellation',()=>{
it('uses real provider normalization after server failure',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response('{}',{status:502})).mockResolvedValueOnce(Response.json({timezone:'UTC',current:{time:1,temperature_2m:12}}));vi.stubGlobal('fetch',f);expect((await loadWeather(PLACES[0],new AbortController().signal)).temp).toBe(12);expect(f).toHaveBeenCalledTimes(2)});
it('does not retry cancelled requests',async()=>{const c=new AbortController();c.abort();const f=vi.fn().mockRejectedValue(new DOMException('Aborted','AbortError'));vi.stubGlobal('fetch',f);await expect(loadWeather(PLACES[0],c.signal)).rejects.toThrow();expect(f).toHaveBeenCalledTimes(1)});
it('surfaces total network failure',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));await expect(loadWeather(PLACES[0],new AbortController().signal)).rejects.toThrow('offline')});
it('search preserves geographic coordinates from provider',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce(new Response('{}',{status:502})).mockResolvedValueOnce(Response.json({results:[{name:'Sydney',latitude:-33.86,longitude:151.2,timezone:'Australia/Sydney'}]})));const r=await searchPlaces('Sydney',new AbortController().signal);expect(r[0].latitude).toBe(-33.86);expect(r[0].timezone).toBe('Australia/Sydney')});
});
describe('additional safety boundaries',()=>{
 it('rejects missing timestamps and invalid provider timezones',()=>{expect(()=>normalize({timezone:'UTC',current:{temperature_2m:1}})).toThrow();expect(()=>normalize({timezone:'not-a-zone',current:{time:1,temperature_2m:1}})).toThrow()});
 it('does not bypass a server rate limit using public failover',async()=>{const f=vi.fn().mockResolvedValue(new Response('{}',{status:429}));vi.stubGlobal('fetch',f);await expect(loadWeather(PLACES[0],new AbortController().signal)).rejects.toThrow();expect(f).toHaveBeenCalledTimes(1)});
 it('limits repeated requests within a time window',()=>{const req=new Request('https://test/api/weather?lat=0&lon=0',{headers:{'cf-connecting-ip':'test-throttle'}});for(let i=0;i<90;i++)expect(guard(req)).toBeNull();expect(guard(req)?.status).toBe(429)});
 it('rejects request bodies',()=>{expect(guard(new Request('https://test/api/search',{method:'GET',headers:{'content-length':'20'}}))?.status).toBe(413)});
});
