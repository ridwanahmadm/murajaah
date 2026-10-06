"use client";
import {useRef,useState} from 'react';
import {resetProgress} from '@/lib/progress';
import {useLibrary} from './library-provider';
export function ResetProgress({subjectId,title}:{subjectId?:string;title?:string}){
 const {refresh}=useLibrary();const dialog=useRef<HTMLDialogElement>(null);const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function reset(){setBusy(true);setMessage('');try{await resetProgress(subjectId);await refresh();dialog.current?.close();setMessage('Progres berhasil direset. Materi dan soal tetap tersimpan.');}catch{setMessage('Progres belum dapat direset. Silakan coba lagi.');}finally{setBusy(false);}}
 return <><button className="plain-button text-link" onClick={()=>{setMessage('');dialog.current?.showModal();}} disabled={busy}>{subjectId?'Reset progres koleksi':'Reset semua progres'}</button><p role="status">{message}</p><dialog ref={dialog} aria-label="Konfirmasi reset progres" onCancel={e=>{if(busy)e.preventDefault();}}><h2>Reset progres{title?` ${title}`:''}?</h2><p>Semua tanda sudah dibaca dan riwayat jawaban kuis {subjectId?'dalam koleksi ini':'pada semua koleksi'} akan dihapus. Materi, soal, dan draf tetap tersimpan.</p><div className="actions"><button className="plain-button text-link" disabled={busy} onClick={()=>dialog.current?.close()}>Batal reset</button><button className="button" disabled={busy} onClick={()=>void reset()}>{busy?'Mereset…':'Ya, reset progres'}</button></div></dialog></>;
}
