'use client';
import {useEffect,useRef,useState} from 'react';
import {initialLife,stepLife,severity,type DirectedWorld} from '@/lib/weather/director';
import {reactToUser} from '@/lib/weather/interaction';
export function useFonLife(world:DirectedWorld){const current=useRef(world);current.current=world;const life=useRef(initialLife()),lastInteraction=useRef(-Infinity);const [action,setAction]=useState(life.current.action);useEffect(()=>{const tick=()=>{if(document.hidden)return;const next=stepLife(life.current,current.current,performance.now()/1000,Math.random());if(next!==life.current){life.current=next;setAction(next.action)}};tick();const timer=setInterval(tick,200);return()=>clearInterval(timer)},[]);return {action,interact:()=>{const now=performance.now()/1000;const next=reactToUser(life.current,current.current,now,lastInteraction.current);if(next!==life.current){life.current=next;lastInteraction.current=now;setAction(next.action)}}}}
