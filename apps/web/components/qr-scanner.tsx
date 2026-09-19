"use client";
import {useEffect,useRef,useState} from "react";
import {BrowserQRCodeReader} from "@zxing/browser";
export default function QrScanner({onResult}:{onResult:(value:string)=>void}){const videoRef=useRef<HTMLVideoElement|null>(null);const controlsRef=useRef<{stop:()=>void}|null>(null);const [error,setError]=useState("");const [active,setActive]=useState(false);
 async function start(){setError("");try{const reader=new BrowserQRCodeReader();const controls=await reader.decodeFromConstraints({video:{facingMode:{ideal:"environment"}},audio:false},videoRef.current!,result=>{const value=result?.getText();if(value)onResult(value);});controlsRef.current=controls;setActive(true);}catch(e){setError(e instanceof Error?e.message:"دسترسی به دوربین ممکن نیست");setActive(false);}}
 function stop(){controlsRef.current?.stop();controlsRef.current=null;setActive(false);}
 useEffect(()=>()=>stop(),[]);
 return <div className="space-y-3"><video ref={videoRef} className={"aspect-video w-full rounded-2xl bg-black object-cover "+(active?"block":"hidden")} muted playsInline/><div className="flex gap-2">{active?<button onClick={stop} className="rounded-xl border px-4 py-2">توقف اسکن</button>:<button onClick={start} className="rounded-xl bg-black px-5 py-3 text-white">اسکن با دوربین</button>}</div>{error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</div>;}