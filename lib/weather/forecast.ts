import type {Weather} from './engine';

/** Calendar dates always belong to the forecast location, never the device. */
export function localDateKey(time:number,timezone:string):string {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(time);
  return ['year','month','day'].map(type=>parts.find(p=>p.type===type)?.value).join('-');
}

export function forecastAt(weather:Weather|null,now:number) {
  if(!weather)return {hours:[],days:[],today:undefined,currentHour:undefined};
  const seconds=now/1000,date=localDateKey(now,weather.timezone);
  // Include the containing hour, but never an expired hour at an exact boundary.
  const hours=weather.hourly.filter(h=>h.time+3600>seconds).slice(0,24);
  const currentHour=hours.find(h=>h.time<=seconds&&seconds<h.time+3600);
  const days=weather.daily.filter(d=>localDateKey(d.time*1000,weather.timezone)>=date);
  const today=days.find(d=>localDateKey(d.time*1000,weather.timezone)===date);
  return {hours,days,today,currentHour};
}

export function forecastNight(time:number,weather:Weather) {
  const date=localDateKey(time*1000,weather.timezone);
  const day=weather.daily.find(d=>localDateKey(d.time*1000,weather.timezone)===date);
  return day?.sunrise!=null&&day.sunset!=null?time<day.sunrise||time>=day.sunset:false;
}
