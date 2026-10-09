'use client';
import {useRef} from 'react';
import {createPortal,useFrame} from '@react-three/fiber';
import * as T from 'three';
import {accessories,type Accessory} from '@/lib/weather/director';
import {FON_ANCHOR_ALIASES} from '@/lib/weather/model-contract';
import type {World} from '@/lib/weather/engine';
/** Anchor transforms belong to the model adapter, never the Life Engine. */
function Gear({kind,visible}:{kind:Accessory;visible:boolean}){const group=useRef<T.Group>(null);useFrame((_,dt)=>{if(!group.current)return;const scale=T.MathUtils.damp(group.current.scale.x,visible?1:.001,5,Math.min(dt,.1));group.current.scale.setScalar(scale);group.current.visible=scale>.005});return <group ref={group} scale={.001}>{kind==='scarf'?<mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.49,.09,8,24]}/><meshStandardMaterial color="#e9b652"/></mesh>:<group><mesh position={[0,.7,0]}><cylinderGeometry args={[.025,.025,1.6,8]}/><meshStandardMaterial color="#8495a1"/></mesh><mesh position={[0,1.5,0]}><sphereGeometry args={[1,20,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#216ae1" side={T.DoubleSide}/></mesh></group>}</group>}
export default function FonAccessories({model,world,sceneScale=1}:{model:T.Object3D;world:World;sceneScale?:number}){const gear=accessories(world);return <>{(['scarf','umbrella'] as const).map(kind=>{if(model.userData.builtInAccessories?.includes(kind))return null;const aliases=FON_ANCHOR_ALIASES[kind==='scarf'?'body':'wing-right'];const anchor=aliases.map(name=>model.getObjectByName(name)).find(Boolean);return anchor?createPortal(<group scale={1/sceneScale}><Gear kind={kind} visible={gear.includes(kind)}/></group>,anchor):null})}</>}
