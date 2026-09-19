"use client";
import {FormEvent,useState} from "react";
export default function Login(){const [msg,setMsg]=useState("");
function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setMsg("ورود در API مرکزی انجام می‌شود؛ نشست‌ها با توکن کوتاه‌عمر و refresh rotation مدیریت خواهند شد.");}
return <main className="mx-auto max-w-md px-6 py-16"><h1 className="text-3xl font-bold">ورود</h1><form onSubmit={submit} className="mt-8 space-y-4"><input required type="email" placeholder="ایمیل" className="w-full rounded-xl border p-3"/><input required type="password" placeholder="رمز عبور" className="w-full rounded-xl border p-3"/><button className="w-full rounded-xl bg-black p-3 text-white">ورود امن</button></form>{msg&&<p className="mt-4 text-sm text-neutral-600">{msg}</p>}</main>}