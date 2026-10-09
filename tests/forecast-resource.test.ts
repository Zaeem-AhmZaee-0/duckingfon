import {describe,it,expect} from 'vitest';
import {forecastAt,forecastNight,localDateKey} from '../lib/weather/forecast';
import {normalize} from '../lib/weather/provider';
import {worldState,weatherSymbol,PLACES} from '../lib/weather/engine';
import {EMPTY_WEATHER,weatherResource} from '../lib/weather/resource';
const seconds=(date:string)=>Date.parse(date)/1000;
const weather=normalize({timezone:'Asia/Tokyo',current:{time:seconds('2026-10-05T14:00:00Z'),temperature_2m:22,is_day:0},
  hourly:{time:['2026-10-05T14:00:00Z','2026-10-05T15:00:00Z','2026-10-05T16:00:00Z'].map(seconds)},
  daily:{time:['2026-10-04T15:00:00Z','2026-10-05T15:00:00Z'].map(seconds),sunrise:['2026-10-04T21:00:00Z','2026-10-05T21:01:00Z'].map(seconds),sunset:['2026-10-05T08:00:00Z','2026-10-06T07:59:00Z'].map(seconds)}});

describe('location-aware forecast windows',()=>{
  it('uses the new local date before UTC midnight',()=>{
    const now=Date.parse('2026-10-05T15:05:00Z');
    expect(localDateKey(now,'Asia/Tokyo')).toBe('2026-10-06');
    expect(forecastAt(weather,now).today).toBe(weather.daily[1]);
    expect(forecastAt(weather,now).days).toEqual([weather.daily[1]]);
  });
  it('does not call the expired previous hour Now at an exact boundary',()=>{
    const result=forecastAt(weather,Date.parse('2026-10-05T15:00:00Z'));
    expect(result.hours[0]).toBe(weather.hourly[1]);
    expect(result.currentHour).toBe(weather.hourly[1]);
  });
  it('includes the containing hour between boundaries',()=>{
    expect(forecastAt(weather,Date.parse('2026-10-05T15:45:00Z')).currentHour).toBe(weather.hourly[1]);
  });
  it('does not present a future reading as current when an hour is missing',()=>{
    const gap={...weather,hourly:[weather.hourly[2]]};
    expect(forecastAt(gap,Date.parse('2026-10-05T15:30:00Z')).currentHour).toBeUndefined();
  });
  it('does not reuse yesterday sunrise when today is absent',()=>{
    expect(forecastAt(weather,Date.parse('2026-10-07T00:00:00Z')).today).toBeUndefined();
  });
  it('returns empty forecasts when disconnected without data',()=>{
    expect(forecastAt(null,Date.now()).hours).toEqual([]);
  });
  it('uses local solar boundaries for hourly night icons',()=>{
    expect(forecastNight(seconds('2026-10-05T21:00:00Z'),weather)).toBe(true);
    expect(forecastNight(seconds('2026-10-05T21:01:00Z'),weather)).toBe(false);
    expect(forecastNight(seconds('2026-10-06T07:59:00Z'),weather)).toBe(true);
  });
  it('agrees on night at the exact sunset boundary',()=>{
    const time=seconds('2026-10-06T07:59:00Z');
    expect(worldState(weather,PLACES[1],time*1000).night).toBe(true);
    expect(forecastNight(time,weather)).toBe(true);
  });
  it('keeps repeated DST hours distinct by timestamp',()=>{
    const hours=[seconds('2026-11-01T05:00:00Z'),seconds('2026-11-01T06:00:00Z')].map(time=>({...weather.hourly[0],time}));
    const result=forecastAt({...weather,timezone:'America/New_York',hourly:hours},Date.parse('2026-11-01T06:00:00Z'));
    expect(result.currentHour?.time).toBe(hours[1].time);
    expect(result.hours).toHaveLength(1);
  });
  it('caps the visible forecast to 24 hours',()=>{
    const start=weather.time;
    const hourly=Array.from({length:168},(_,i)=>({...weather.hourly[0],time:start+i*3600}));
    expect(forecastAt({...weather,hourly},start*1000).hours).toHaveLength(24);
  });
});

describe('refresh and stale-request safety',()=>{
  const first=weatherResource(EMPTY_WEATHER,{type:'start',key:'Tokyo',request:1});
  const loaded=weatherResource(first,{type:'success',request:1,weather});
  it('retains the latest reading during a same-place refresh',()=>{
    const pending=weatherResource(loaded,{type:'start',key:'Tokyo',request:2});
    expect(pending.weather).toBe(weather);expect(pending.loading).toBe(true);
  });
  it('retains data and exposes a refresh failure honestly',()=>{
    const pending=weatherResource(loaded,{type:'start',key:'Tokyo',request:2});
    const failed=weatherResource(pending,{type:'failure',request:2,error:'offline'});
    expect(failed.weather).toBe(weather);expect(failed.error).toBe('offline');expect(failed.loading).toBe(false);
  });
  it('clears another location data immediately',()=>{
    expect(weatherResource(loaded,{type:'start',key:'Sydney',request:2}).weather).toBeNull();
  });
  it('ignores late success from a superseded request',()=>{
    const pending=weatherResource(loaded,{type:'start',key:'Sydney',request:2});
    expect(weatherResource(pending,{type:'success',request:1,weather})).toBe(pending);
  });
  it('ignores late errors from a superseded request',()=>{
    const pending=weatherResource(loaded,{type:'start',key:'Sydney',request:2});
    expect(weatherResource(pending,{type:'failure',request:1,error:'offline'})).toBe(pending);
  });
  it('clears errors after a successful retry',()=>{
    const failed=weatherResource(first,{type:'failure',request:1,error:'offline'});
    expect(weatherResource(failed,{type:'success',request:1,weather}).error).toBe('');
  });
});


describe('honest weather symbols',()=>{
  it('never draws a sun for missing or unsupported codes',()=>{expect(weatherSymbol(-1)).toBe('unknown');expect(weatherSymbol(100)).toBe('unknown')});
  it('includes freezing drizzle and freezing rain',()=>{for(const code of [56,57,66,67])expect(weatherSymbol(code)).toBe('rain')});
  it('separates fog and thunderstorms from ordinary clouds',()=>{expect(weatherSymbol(48)).toBe('fog');expect(weatherSymbol(95)).toBe('storm')});
  it('uses the moon for clear nights',()=>{expect(weatherSymbol(0,true)).toBe('moon');expect(weatherSymbol(0,false)).toBe('sun')});
});
