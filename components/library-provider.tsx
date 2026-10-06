"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {db,initialize} from '@/lib/db';
import type {Subject,Topic,Lesson,Reading} from '@/lib/schema';
type Library={subjects:Subject[];topics:Topic[];lessons:Lesson[];readings:Reading[];loading:boolean;error:string;complete:(id:string)=>Promise<void>};
const Context=createContext<Library|null>(null);
export function LibraryProvider({children}:{children:ReactNode}){const [data,setData]=useState<Omit<Library,'complete'>>({subjects:[],topics:[],lessons:[],readings:[],loading:true,error:''});useEffect(()=>{let alive=true;initialize().then(async()=>{const [subjects,topics,lessons,readings]=await Promise.all([db.subjects.toArray(),db.topics.orderBy('order').toArray(),db.lessons.toArray(),db.readings.toArray()]);lessons.sort((a,b)=>(topics.find(t=>t.id===a.topicId)?.order??0)-(topics.find(t=>t.id===b.topicId)?.order??0));if(alive)setData({subjects,topics,lessons,readings,loading:false,error:''});}).catch(()=>{if(alive)setData(d=>({...d,loading:false,error:'Penyimpanan lokal tidak tersedia. Izinkan penyimpanan browser, lalu muat ulang.'}));});return()=>{alive=false;};},[]);async function complete(id:string){const reading={lessonId:id,completedAt:Date.now()};await db.readings.put(reading);setData(d=>({...d,readings:[...d.readings.filter(r=>r.lessonId!==id),reading]}));}return <Context.Provider value={{...data,complete}}>{children}</Context.Provider>;}
export function useLibrary(){const value=useContext(Context);if(!value)throw new Error('LibraryProvider required');return value;}
export function LibraryState(){const {loading,error}=useLibrary();return loading?<p role="status">Menyiapkan perpustakaan Anda…</p>:error?<p role="alert" className="notice">{error}</p>:null;}
