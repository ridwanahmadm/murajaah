"use client";
import {useEffect,useState} from 'react';
import {formatCalendar} from '@/lib/calendar';
export function HomeClock(){
 const [now,setNow]=useState<Date|null>(null);
 useEffect(()=>{const tick=()=>setNow(new Date());const first=setTimeout(tick,0);const interval=setInterval(tick,1000);const visible=()=>{if(document.visibilityState==='visible')tick();};document.addEventListener('visibilitychange',visible);return()=>{clearTimeout(first);clearInterval(interval);document.removeEventListener('visibilitychange',visible);};},[]);
 const dates=now?formatCalendar(now):null;
 return <aside className="home-clock" aria-label="Jam dan tanggal"><div><p className="eyebrow">WAKTU SETEMPAT</p><time className="clock-time" dateTime={now?.toISOString()}>{dates?.clock??'—'}</time></div><div><p aria-label="Tanggal Masehi">{dates?.gregorian??'Menyiapkan tanggal…'}</p><p className="muted" aria-label="Tanggal Hijriah">{dates?.hijri??'—'} · Hijriah (perhitungan)</p></div></aside>;
}
