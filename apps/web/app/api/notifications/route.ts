import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {API_BASE,AUTH_COOKIE} from "../../../lib/auth-proxy";
export async function GET(){const access=(await cookies()).get(AUTH_COOKIE.access)?.value;if(!access)return NextResponse.json({message:"Authentication required"},{status:401});const upstream=await fetch(API_BASE+"/api/notifications",{headers:{authorization:"Bearer "+access},cache:"no-store"});const data=await upstream.json();return NextResponse.json(data,{status:upstream.status});}