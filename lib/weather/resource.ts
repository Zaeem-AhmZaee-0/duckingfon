import type {Weather} from './engine';

export type WeatherResource={key:string;request:number;weather:Weather|null;loading:boolean;error:string};
export type ResourceEvent=
  |{type:'start';key:string;request:number}
  |{type:'success';request:number;weather:Weather}
  |{type:'failure';request:number;error:string};
export const EMPTY_WEATHER:WeatherResource={key:'',request:0,weather:null,loading:true,error:''};

/** A failed refresh keeps the last reading; a different location never inherits it. */
export function weatherResource(state:WeatherResource,event:ResourceEvent):WeatherResource {
  if(event.type==='start')return {key:event.key,request:event.request,weather:state.key===event.key?state.weather:null,loading:true,error:''};
  if(event.request!==state.request)return state;
  if(event.type==='success')return {...state,weather:event.weather,loading:false,error:''};
  return {...state,loading:false,error:event.error};
}
