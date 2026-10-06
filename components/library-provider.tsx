"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {db,initialize} from '@/lib/db';
import type {Subject,Topic,Lesson,Reading} from '@/lib/schema';
type Data={subjects:Subject[];topics:Topic[];lessons:Lesson[];allLessons:Lesson[];readings:Reading[];verifiedOnly:boolean;loading:boolean;error:string};
type Library=Data&{complete:(id:string)=>Promise<void>;refresh:()=>Promise<void>};
const Context=createContext<Library|null>(null);
async function readLibrary():Promise<Data>{
 const [subjects,topics,allLessons,readings,settings]=await Promise.all([db.subjects.toArray(),db.topics.orderBy('order').toArray(),db.lessons.toArray(),db.readings.toArray(),db.meta.get('verified-only')]);
 const verifiedOnly=settings?.value==='true';const lessons=allLessons.filter(l=>!verifiedOnly||l.status==='verified');
 lessons.sort((a,b)=>(topics.find(t=>t.id===a.topicId)?.order??0)-(topics.find(t=>t.id===b.topicId)?.order??0));
 return {subjects,topics,lessons,allLessons,readings,verifiedOnly,loading:false,error:''};
}
export function LibraryProvider({children}:{children:ReactNode}){
 const [data,setData]=useState<Data>({subjects:[],topics:[],lessons:[],allLessons:[],readings:[],verifiedOnly:false,loading:true,error:''});
 useEffect(()=>{let alive=true;initialize().then(readLibrary).then(next=>{if(alive)setData(next);}).catch(()=>{if(alive)setData(d=>({...d,loading:false,error:'Penyimpanan lokal tidak tersedia. Izinkan penyimpanan browser, lalu muat ulang.'}));});return()=>{alive=false;};},[]);
 async function complete(id:string){const reading={lessonId:id,completedAt:Date.now()};await db.transaction('rw',[db.lessons,db.readings],async()=>{if(!await db.lessons.get(id))throw new Error('Materi sudah dihapus.');await db.readings.put(reading);});setData(d=>({...d,readings:[...d.readings.filter(r=>r.lessonId!==id),reading]}));}
 async function refresh(){setData(await readLibrary());}
 return <Context.Provider value={{...data,complete,refresh}}>{children}</Context.Provider>;
}
export function useLibrary(){const value=useContext(Context);if(!value)throw new Error('LibraryProvider required');return value;}
export function LibraryState(){const {loading,error}=useLibrary();return loading?<p role="status">Menyiapkan perpustakaan Anda…</p>:error?<p role="alert" className="notice">{error}</p>:null;}
