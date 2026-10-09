import {NextResponse,type NextRequest} from 'next/server';
export function middleware(_req:NextRequest){const response=NextResponse.next();response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(self)');return response}
export const config={matcher:['/((?!_next/static|_next/image|favicon.svg).*)']};
