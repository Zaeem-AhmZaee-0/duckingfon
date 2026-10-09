'use client';
import {useEffect,useState} from 'react';
export function useWebGL(){const [supported,setSupported]=useState<boolean|null>(null);useEffect(()=>{try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');setSupported(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{setSupported(false)}},[]);return supported}
