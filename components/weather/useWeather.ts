'use client';
import {useEffect,useReducer,useRef,useState} from 'react';
import type {Place} from '@/lib/weather/engine';
import {loadWeather} from '@/lib/weather/client';
import {developmentWeather} from '@/lib/weather/development-fixture';
import type {Simulation} from '@/lib/weather/director';
import {EMPTY_WEATHER,weatherResource} from '@/lib/weather/resource';

export function useWeather(place:Place,simulation?:Simulation) {
  const [state,dispatch]=useReducer(weatherResource,EMPTY_WEATHER);
  const [revision,refresh]=useReducer(n=>n+1,0);
  const [now,setNow]=useState(Date.now);
  const request=useRef(0),lastAttempt=useRef(0);
  const key=`${place.latitude},${place.longitude},${simulation?'demo':'live'}`;
  useEffect(()=>{
    const tick=()=>setNow(Date.now());
    const resume=()=>{tick();if(document.visibilityState==='visible'&&Date.now()-lastAttempt.current>=60000)refresh()};
    const online=()=>{tick();refresh()};
    const clock=setInterval(tick,30000);
    const update=setInterval(()=>{if(document.visibilityState==='visible')refresh()},600000);
    document.addEventListener('visibilitychange',resume);
    window.addEventListener('online',online);
    return()=>{clearInterval(clock);clearInterval(update);document.removeEventListener('visibilitychange',resume);window.removeEventListener('online',online)};
  },[]);
  useEffect(()=>{
    const controller=new AbortController(),id=++request.current;
    lastAttempt.current=Date.now();
    dispatch({type:'start',key,request:id});
    if(simulation&&process.env.NODE_ENV==='development') {
      dispatch({type:'success',request:id,weather:developmentWeather(simulation)});
      return()=>controller.abort();
    }
    loadWeather(place,controller.signal).then(weather=>{
      if(!controller.signal.aborted)dispatch({type:'success',request:id,weather});
    }).catch(()=>{
      if(!controller.signal.aborted)dispatch({type:'failure',request:id,error:'Weather could not be reached. Check your connection and try again.'});
    });
    return()=>controller.abort();
  },[key,place,revision,simulation]);
  // Hide the previous location even before its effect cleanup/start has run.
  return {...state,weather:state.key===key?state.weather:null,loading:state.key!==key||state.loading,error:state.key===key?state.error:'',now,refresh};
}
