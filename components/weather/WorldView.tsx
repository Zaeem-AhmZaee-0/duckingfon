'use client';
import {lazy,Suspense,useEffect} from 'react';
import {useWebGL} from './useWebGL';
import {atmosphereColor,type DirectedWorld} from '@/lib/weather/director';
import type {Graphics} from '@/lib/weather/preferences';
import type {Action} from '@/lib/weather/engine';
const WorldScene=lazy(()=>import('./WorldScene'));
export function StaticWorld({world,onMode}:{world:DirectedWorld;onMode?:(mode:boolean)=>void}){useEffect(()=>onMode?.(false),[onMode]);const color=atmosphereColor(world);return <div className={`scene-fallback ${world.night?'static-night':''}`} style={{backgroundColor:color}}><img className="fon-portrait" src="/assets/fon-canonical-still.png" alt="Fon in his blue hooded jacket and backpack — still-image fallback" width={1254} height={1254} fetchPriority="high"/><span>Illustrated world · {world.band}</span></div>}
export default function WorldView(props:{world:DirectedWorld;still:boolean;action:Action;onInteract:()=>void;graphics:Graphics;onMode:(mode:boolean)=>void}){const supported=useWebGL();return supported?<Suspense fallback={<StaticWorld world={props.world} onMode={props.onMode}/>}><WorldScene {...props}/></Suspense>:<StaticWorld world={props.world} onMode={props.onMode}/>}
