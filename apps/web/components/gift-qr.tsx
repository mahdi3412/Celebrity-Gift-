"use client";
import {QRCodeSVG} from "qrcode.react";
export default function GiftQr({value}:{value:string}){return <div className="inline-flex rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"><QRCodeSVG value={value} size={180} includeMargin/></div>;}