import {solarState,type SolarPhase} from './solar';
import {forecastAt} from './forecast';
export type Place={name:string;country:string;latitude:number;longitude:number;timezone?:string};
export type Condition='clear'|'cloudy'|'rain'|'heavy-rain'|'snow'|'storm'|'fog'|'wind'|'hot'|'cold'|'unknown';
export type Hour={time:number;temp:number|null;code:number;rain:number|null;wind:number|null;humidity:number|null;uv:number|null;visibility?:number|null};
export type Day={time:number;high:number|null;low:number|null;code:number;rain:number|null;sunrise:number|null;sunset:number|null};
export type Weather={latitude?:number;longitude?:number;timezone:string;fetchedAt:number;time:number;temp:number;feels:number|null;code:number;wind:number|null;humidity:number|null;pressure:number|null;precip:number|null;cloud:number|null;isDay:boolean;hourly:Hour[];daily:Day[]};
export const PLACES:Place[]=[{name:'Lahore',country:'Pakistan',latitude:31.5497,longitude:74.3436,timezone:'Asia/Karachi'},{name:'Tokyo',country:'Japan',latitude:35.6762,longitude:139.6503,timezone:'Asia/Tokyo'},{name:'London',country:'United Kingdom',latitude:51.5074,longitude:-0.1278,timezone:'Europe/London'},{name:'Reykjavík',country:'Iceland',latitude:64.1466,longitude:-21.9426,timezone:'Atlantic/Reykjavik'},{name:'Sydney',country:'Australia',latitude:-33.8688,longitude:151.2093,timezone:'Australia/Sydney'}];
export function condition(code:number,temp=20,wind=0):Condition{if([95,96,99].includes(code))return 'storm';if([71,73,75,77,85,86].includes(code))return 'snow';if([65,67,82].includes(code))return 'heavy-rain';if([51,53,55,56,57,61,63,66,80,81].includes(code))return 'rain';if([45,48].includes(code))return 'fog';if(wind>=40)return 'wind';if(temp>=35)return 'hot';if(temp<=2)return 'cold';if([2,3].includes(code))return 'cloudy';if([0,1].includes(code))return 'clear';return 'unknown'}
export function conditionLabel(code:number){return code===0?'Clear skies':code===1?'Mostly clear':code===2?'Partly cloudy':code===3?'Overcast':[45,48].includes(code)?'Foggy':[51,53,55,56,57].includes(code)?'Drizzle':[61,63,65,66,67,80,81,82].includes(code)?'Rain':[71,73,75,77,85,86].includes(code)?'Snow':[95,96,99].includes(code)?'Thunderstorms':'Conditions unavailable'}
export function weatherSymbol(code:number,night=false){
  if([95,96,99].includes(code))return 'storm';
  if([71,73,75,77,85,86].includes(code))return 'snow';
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return 'rain';
  if([45,48].includes(code))return 'fog';
  if([2,3].includes(code))return 'cloud';
  if([0,1].includes(code))return night?'moon':'sun';
  return 'unknown';
}
export function season(lat:number,month:number){if(Math.abs(lat)<15)return 'Tropical';const idx=Math.floor((month%12)/3);return (lat<0?['Summer','Autumn','Winter','Spring']:['Winter','Spring','Summer','Autumn'])[idx]}
export function localParts(now:number,tz:string){const d=new Date(now);const ps=new Intl.DateTimeFormat('en-GB',{timeZone:tz,month:'numeric',hour:'numeric',hourCycle:'h23'}).formatToParts(d);return {month:Number(ps.find(x=>x.type==='month')?.value),hour:Number(ps.find(x=>x.type==='hour')?.value)}}
export function timeBand(now:number,rise:number|null,set:number|null,isDay:boolean){if(rise&&Math.abs(now/1000-rise)<2700)return 'Sunrise';if(set&&Math.abs(now/1000-set)<3600)return 'Golden hour';if(rise&&set)return now/1000>=rise&&now/1000<set?'Day':'Night';return isDay?'Day':'Night'}
export type World={condition:Condition;band:string;season:string;night:boolean;wet:boolean;cloud:number;wind:number;temp:number;daylight:number;solarPhase?:SolarPhase};
export function worldState(w:Weather|null,p:Place,now:number):World{if(!w)return {condition:'unknown',band:'Waiting for weather',season:'',night:false,wet:false,cloud:.25,wind:0,temp:20,daylight:.8};const parts=localParts(now,w.timezone);const today=forecastAt(w,now).today;const solar=solarState(now,today?.sunrise??null,today?.sunset??null,w.isDay);const solarBand=solar.phase;const band=solarBand==='Day'?(parts.hour<12?'Morning':'Afternoon'):solarBand;const cond=condition(w.code,w.temp,w.wind??0);const night=today?.sunrise&&today?.sunset?now/1000<today.sunrise||now/1000>=today.sunset:!w.isDay;const daylight=solar.daylight;return {condition:cond,band,season:season(p.latitude,parts.month),night,wet:['rain','heavy-rain','storm'].includes(cond),cloud:(w.cloud??50)/100,wind:w.wind??0,temp:w.temp,daylight,solarPhase:solar.phase}}
export type Action='look'|'sit'|'walk'|'stretch'|'sleep'|'gaze'|'shiver'|'brace'|'shelter'|'rain-watch'|'play'|'rest';
export function behaviorPool(w:World):Action[]{if(w.condition==='storm'||w.condition==='heavy-rain')return ['shelter','brace','look'];if(w.condition==='rain')return ['rain-watch','look','walk'];if(w.condition==='snow')return ['shiver','play','look'];if(w.condition==='wind')return ['brace','look','sit'];if(w.temp<=2)return ['shiver','sit','look'];if(w.temp>=35)return ['rest','sit','look'];if(w.night)return ['sleep','gaze','sit'];if(w.band==='Sunrise')return ['stretch','look','walk'];if(w.condition==='fog')return ['look','sit','walk'];return ['look','walk','sit','stretch','play','gaze']}
export function nextBehavior(w:World,recent:Action[],random=Math.random()):Action{const pool=behaviorPool(w);const choices=pool.filter(a=>!recent.slice(-2).includes(a));const available=choices.length?choices:pool;return available[Math.min(available.length-1,Math.floor(random*available.length))]}
export function geoPoint(lat:number,lon:number,r=1):[number,number,number]{const phi=lat*Math.PI/180,theta=lon*Math.PI/180;return [r*Math.cos(phi)*Math.cos(theta),r*Math.sin(phi),-r*Math.cos(phi)*Math.sin(theta)]}
export function tempDisplay(n:number|null|undefined,unit:string){return n==null?'—':`${Math.round(unit==='F'?n*9/5+32:n)}°`}
export function formatTime(t:number,tz:string){return new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(t*1000)}
