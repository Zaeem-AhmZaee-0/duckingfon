import {describe,it,expect} from 'vitest';
import {forecastURL,normalize} from '../lib/weather/provider';
import {PLACES,worldState} from '../lib/weather/engine';
import {forecastAt} from '../lib/weather/forecast';

// Explicit network smoke test. Never replace a failed response with fixtures.
describe.skipIf(process.env.RUN_LIVE_WEATHER!=='1')('live provider integration',()=>{
  for(const place of [PLACES[0],PLACES[1],PLACES[4]])it(`normalizes actual ${place.name} weather`,async()=>{
    const response=await fetch(forecastURL(place.latitude,place.longitude),{signal:AbortSignal.timeout(20000)});
    expect(response.ok).toBe(true);
    const weather=normalize(await response.json());
    expect(weather.timezone).toBe(place.timezone);
    expect(Math.abs(weather.latitude!-place.latitude)).toBeLessThan(.2);
    expect(Math.abs(weather.longitude!-place.longitude)).toBeLessThan(.2);
    expect(weather.hourly.length).toBeGreaterThanOrEqual(24);
    expect(weather.daily).toHaveLength(7);
    const window=forecastAt(weather,weather.time*1000);
    expect(window.today).toBeDefined();
    expect(window.currentHour).toBeDefined();
    expect(worldState(weather,place,weather.time*1000).condition).not.toBe('unknown');
    console.info(JSON.stringify({city:place.name,timezone:weather.timezone,providerTime:weather.time,temp:weather.temp,humidity:weather.humidity,wind:weather.wind,pressure:weather.pressure,precip:weather.precip,sunrise:window.today?.sunrise,sunset:window.today?.sunset,uv:window.currentHour?.uv,visibility:window.currentHour?.visibility}));
  },25000);
  it('returns actual global search coordinates',async()=>{
    const response=await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Sydney&count=8&language=en&format=json',{signal:AbortSignal.timeout(20000)});
    expect(response.ok).toBe(true);
    const data=await response.json() as {results:{country_code:string;latitude:number;longitude:number;timezone:string}[]};
    const sydney=data.results.find((p:{country_code:string})=>p.country_code==='AU');
    expect(sydney?.latitude).toBeCloseTo(-33.8688,1);
    expect(sydney?.longitude).toBeCloseTo(151.2093,1);
    expect(sydney?.timezone).toBe('Australia/Sydney');
  },25000);
});
