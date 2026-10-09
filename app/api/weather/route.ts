import {forecastURL,normalize} from '@/lib/weather/provider';
import {guard,reply,coordinates} from '@/lib/weather/security';
export async function GET(req:Request){const blocked=guard(req);if(blocked)return blocked;const p=coordinates(new URL(req.url));if(!p)return reply({error:'Invalid location'},400);try{const response=await fetch(forecastURL(p.latitude,p.longitude),{signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();return reply(normalize(await response.json()),200,300)}catch{return reply({error:'Weather is temporarily unavailable. Please try again.'},502)}}
