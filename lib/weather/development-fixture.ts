import type {Weather} from './engine';
import type {Simulation} from './director';
/** Explicit demonstration values. Never used by the live route. */
export function developmentWeather(sim:Simulation):Weather {
 const now=Math.floor(Date.now()/3600000)*3600,day=Math.floor(now/86400)*86400;
 const codes:Record<string,number>={clear:0,cloudy:3,rain:61,'heavy-rain':65,snow:73,storm:95,fog:45,wind:2,hot:0,cold:0};
 const temp=sim.condition==='snow'?Math.min(sim.temp,1):sim.temp,code=codes[sim.condition]??0;
 return {timezone:'Asia/Karachi',fetchedAt:Date.now(),time:now,temp,feels:temp,code,wind:sim.wind,humidity:null,pressure:null,precip:sim.precip,cloud:sim.cloud,isDay:sim.time!=='Night',hourly:Array.from({length:48},(_,i)=>({time:now+i*3600,temp,code,rain:null,wind:sim.wind,humidity:null,uv:null,visibility:null})),daily:Array.from({length:7},(_,i)=>({time:day+i*86400,high:temp,low:temp,code,rain:null,sunrise:null,sunset:null}))};
}
