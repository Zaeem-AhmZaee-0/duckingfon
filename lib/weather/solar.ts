export type SolarPhase='Pre-sunrise'|'Sunrise'|'Day'|'Golden hour'|'Sunset'|'Blue hour'|'Night';
const smooth=(n:number)=>{const x=Math.max(0,Math.min(1,n));return x*x*(3-2*x)};
/** Relative to the selected location's provider-supplied sun events, never device hours. */
export function solarState(now:number,rise:number|null,set:number|null,isDay:boolean):{phase:SolarPhase;daylight:number} {
  if(rise==null||set==null||set<=rise)return {phase:isDay?'Day':'Night',daylight:isDay?.9:.04};
  const seconds=now/1000;
  const phase=seconds<rise-2700?'Night':seconds<rise?'Pre-sunrise':seconds<rise+1800?'Sunrise':seconds<set-3600?'Day':seconds<set?'Golden hour':seconds<set+1200?'Sunset':seconds<set+3600?'Blue hour':'Night';
  return {phase,daylight:.04+.9*Math.min(smooth((seconds-rise+2700)/5400),smooth((set+3600-seconds)/7200))};
}
