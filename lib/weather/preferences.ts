import type {Place} from './engine';
export type Graphics='AUTO'|'HIGH'|'BALANCED'|'LOW';
export const GRAPHICS:Graphics[]=['AUTO','HIGH','BALANCED','LOW'];
export function validPlace(value:unknown):value is Place {
  if(!value||typeof value!=='object')return false;
  const p=value as Place;
  return typeof p.name==='string'&&p.name.length>0&&p.name.length<=160&&typeof p.country==='string'&&Number.isFinite(p.latitude)&&Math.abs(p.latitude)<=90&&Number.isFinite(p.longitude)&&Math.abs(p.longitude)<=180;
}
export function recentPlaces(places:Place[],place:Place):Place[] {
  return [place,...places.filter(p=>p.latitude!==place.latitude||p.longitude!==place.longitude)].slice(0,5);
}
