import {notFound} from 'next/navigation';
import WeatherApp from '@/components/weather/WeatherApp';
export default function Lab(){if(process.env.NODE_ENV!=='development')notFound();return <WeatherApp lab/>}
