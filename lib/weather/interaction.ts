import type {Action,World} from './engine';
import type {LifeState} from './director';

export const INTERACTION_COOLDOWN=5;
export type Attention={x:number;y:number;until:number};
export function pointerAttention(x:number,y:number,now:number,touch:boolean,still:boolean):Attention {
  if(touch||still)return {x:0,y:0,until:0};
  return {x:Math.max(-.22,Math.min(.22,x*.22)),y:Math.max(-.12,Math.min(.12,-y*.12)),until:now+2.5};
}
export function interactionAction(world:World):Action {
  if(world.condition==='storm'||world.condition==='heavy-rain')return 'shelter';
  if(world.condition==='wind')return 'brace';
  if(world.condition==='rain')return 'rain-watch';
  if(world.temp<2)return 'shiver';
  if(world.temp>35)return 'rest';
  if(world.night)return 'gaze';
  if(world.condition==='snow')return 'play';
  return 'look';
}
export function reactToUser(state:LifeState,world:World,now:number,lastInteraction:number) {
  if(now-lastInteraction<INTERACTION_COOLDOWN)return state;
  const action=interactionAction(world);
  return {...state,action,started:now,until:now+3.5,last:{...state.last,[action]:now}};
}
