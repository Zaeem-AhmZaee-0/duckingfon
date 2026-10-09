'use client';
import {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import type {DirectedWorld} from '@/lib/weather/director';
/** Streaks follow wind; snow drifts slowly. Both fade using interpolated world state. */
export default function WeatherParticles({state,kind,count,still}:{state:React.RefObject<DirectedWorld>;kind:'rain'|'snow';count:number;still:boolean}){
 const ref=useRef<T.Points|T.LineSegments>(null),stride=kind==='rain'?2:1;
 const positions=useMemo(()=>{const p=new Float32Array(count*3*stride);for(let i=0;i<count;i++){const x=Math.sin(i*78.233)*9,y=(i*.317)%12,z=Math.cos(i*13.12)*7;for(let j=0;j<stride;j++){const k=(i*stride+j)*3;p[k]=x;p[k+1]=y+j*.24;p[k+2]=z}}return p},[count,stride]);
 useFrame(({clock},delta)=>{if(!ref.current)return;const dt=Math.min(delta,.06),w=state.current,mat=ref.current.material as T.Material&{opacity:number};mat.opacity=w[kind]*(kind==='rain'?.42:.85);if(still||w[kind]<.005)return;const a=ref.current.geometry.attributes.position;for(let i=0;i<count;i++){const k=i*stride;let x=a.getX(k)+dt*(w.wind/30+(kind==='snow'?Math.sin(clock.elapsedTime+i)*.24:0)),y=a.getY(k)-dt*(kind==='rain'?9+w.rain*6:.65);if(y<-.5)y=12;if(x>9)x=-9;a.setXYZ(k,x,y,a.getZ(k));if(stride===2)a.setXYZ(k+1,x-w.wind*.0015,y+.18+w.rain*.22,a.getZ(k));}a.needsUpdate=true});
 const geometry=<bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry>;
 return kind==='rain'?<lineSegments ref={ref as React.RefObject<T.LineSegments>}>{geometry}<lineBasicMaterial color="#c5e2ee" transparent opacity={0} depthWrite={false}/></lineSegments>:<points ref={ref as React.RefObject<T.Points>}>{geometry}<pointsMaterial color="#f9fcff" size={.055} transparent opacity={0} depthWrite={false}/></points>
}
