"use client";
import {ArabicText} from '@/components/arabic-text';
import {ResetProgress} from '@/components/reset-progress';
import {orderedLessons} from '@/lib/lesson-order';
import {LessonEditor} from '@/components/lesson-editor';
import Link from 'next/link';
import {useParams,useRouter} from 'next/navigation';
import {useRef,useState} from 'react';
import {useLibrary,LibraryState} from '@/components/library-provider';
import {deleteLesson,readLessonSnapshot,type LessonSnapshot} from '@/lib/lessons';
import {pdfPath} from '@/lib/tuhfatul-athfal';
export default function LessonPage(){
 const {lessonId}=useParams<{lessonId:string}>();const router=useRouter();
 const {allLessons,topics,subjects,loading,error,readings,complete,uncomplete,verifiedOnly,refresh}=useLibrary();
 const [message,setMessage]=useState(''),[actionError,setActionError]=useState(''),[busy,setBusy]=useState(false);
 const [editing,setEditing]=useState<LessonSnapshot|null>(null),[deleting,setDeleting]=useState<LessonSnapshot|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);const lesson=allLessons.find(l=>l.id===lessonId);
 async function prepare(mode:'edit'|'delete'){setBusy(true);setActionError('');try{const snapshot=await readLessonSnapshot(lessonId);if(mode==='edit'){setEditing(snapshot);setMessage('');}else{setDeleting(snapshot);dialog.current?.showModal();}}catch(e){setActionError(e instanceof Error?e.message:'Materi belum dapat dibaca.');}finally{setBusy(false);}}
 async function saved(){setEditing(null);setMessage('Perubahan tersimpan.');try{await refresh();}catch{setMessage('Perubahan sudah tersimpan. Muat ulang untuk melihat versi terbaru.');}}
 async function remove(){if(!deleting||busy)return;setBusy(true);setActionError('');try{await deleteLesson(deleting);dialog.current?.close();await refresh();router.replace(subjectId?`/materi/koleksi/${encodeURIComponent(subjectId)}`:'/materi');}catch(e){setActionError(e instanceof Error?e.message:'Materi belum dapat dihapus.');}finally{setBusy(false);}}
 if(loading||error)return <LibraryState/>;
 if(!lesson)return <><h1>Materi tidak ditemukan</h1><Link className="text-link" href="/materi">Kembali ke materi</Link></>;
 const subjectId=topics.find(t=>t.id===lesson.topicId)?.subjectId??'';const subject=subjects.find(s=>s.id===subjectId);
 const sequence=orderedLessons(allLessons.filter(l=>!verifiedOnly||l.status==='verified'||l.id===lesson.id),topics,subjectId);const position=sequence.findIndex(l=>l.id===lesson.id);const previous=sequence[position-1],next=sequence[position+1];
 const done=readings.some(r=>r.lessonId===lesson.id);
 return <article className="lesson-page"><Link href={`/materi/koleksi/${encodeURIComponent(subjectId)}`} className="text-link">Kembali ke koleksi</Link><header className="page-head"><p className="eyebrow">{subjects.find(s=>s.id===topics.find(t=>t.id===lesson.topicId)?.subjectId)?.title} · PELAJARAN SINGKAT</p><h1>{lesson.title}</h1><span className="badge">{lesson.status==='draft'?'Draf':'Terverifikasi'}</span>{!editing&&<div className="actions"><button className="plain-button text-link" disabled={busy} onClick={()=>void prepare('edit')}>Edit materi</button><button className="plain-button text-link danger" disabled={busy} onClick={()=>void prepare('delete')}>Hapus materi</button></div>}</header>
 <p role="status">{message}</p>{actionError&&!deleting&&<p role="alert" className="notice">{actionError}</p>}
 {editing?<LessonEditor snapshot={editing} onSaved={()=>void saved()} onCancel={()=>setEditing(null)}/>:<>
 {lesson.origin==='ai'&&<p className="notice">Draf disusun dengan bantuan AI. Verifikasi isi dan pengucapannya dengan sumber atau guru.</p>}
 {lesson.sourceRef.document&&<p className="notice">Ringkasan disusun dari PDF Tuhfatul Athfal yang Anda lampirkan. Nomor halaman cetak dan PDF dicantumkan pada rujukan; baca sumber untuk penjelasan dan contoh lengkap.</p>}
 {lesson.status==='draft'&&<p className="notice">Materi ini belum terverifikasi. Tinjau dengan sumber atau guru sebelum dijadikan pegangan.</p>}
 <section><h2>Memahami materi</h2><p><ArabicText text={lesson.explanation}/></p></section><section><h2>Ringkasan materi</h2><div className="rules">{lesson.rules.map((r,i)=><div key={i}><h3><ArabicText text={r.name}/></h3><p><ArabicText text={r.description}/></p></div>)}</div></section>
 {lesson.examples.length>0&&<section><h2>Contoh dari sumber</h2>{lesson.examples.map((e,i)=><div className="example" key={i}><p className="arabic" lang="ar" dir="rtl">{e.arabic}</p><p>{e.transliteration}</p><p>{e.meaning}</p><small>{e.note}</small></div>)}</section>}
 <section className="source"><h2>Rujukan</h2><p><ArabicText text={lesson.sourceRef.title}/></p><p>Halaman / bab: {lesson.sourceRef.locator||'Belum ditentukan'}</p>{lesson.sourceRef.document&&<a className="text-link" href={`${pdfPath}#page=${lesson.sourceRef.pdfPage??1}`} target="_blank" rel="noopener noreferrer">Baca PDF sumber (tab baru)</a>}{lesson.sourceRef.url&&<a className="text-link" href={lesson.sourceRef.url} target="_blank" rel="noopener noreferrer">Buka rujukan (tab baru)</a>}{lesson.origin==='seed'&&<small>Kerangka topik standar; bukan kutipan atau susunan bab buku.</small>}</section>
 <div className="reading-actions"><button className="button" disabled={busy} onClick={async()=>{setBusy(true);try{if(done)await uncomplete(lesson.id);else await complete(lesson.id);setMessage(done?'Materi ditandai belum dibaca.':'Kemajuan membaca tersimpan.');}catch{setMessage('Kemajuan belum tersimpan. Silakan coba lagi.');}finally{setBusy(false);}}}>{done?'Tandai belum dibaca':'Tandai sudah dibaca'}</button><p className="muted">{done?'Sudah dibaca':'Belum dibaca'}</p></div>
 <div className="lesson-navigation" role="group" aria-label="Perpindahan pelajaran">{previous?<Link className="card" href={`/materi/${encodeURIComponent(previous.id)}`}><small>← Materi sebelumnya</small><strong>{previous.title}</strong></Link>:<p className="muted">Ini pelajaran pertama.</p>}{next?<Link className="card" href={`/materi/${encodeURIComponent(next.id)}`}><small>Materi selanjutnya →</small><strong>{next.title}</strong></Link>:<p className="muted">Ini pelajaran terakhir.</p>}</div>
 <ResetProgress subjectId={subjectId} title={subject?.title}/>

 </>}
 <dialog ref={dialog} aria-labelledby="delete-title" aria-describedby="delete-description" onCancel={e=>{if(busy)e.preventDefault();}} onClose={()=>setDeleting(null)}><h2 id="delete-title">Hapus materi ini?</h2><p id="delete-description">“{lesson.title}” beserta {deleting?.questions.length??0} soal terkait, riwayat jawaban, dan kemajuan membacanya akan dihapus dari perangkat ini. Tindakan ini tidak dapat dibatalkan. Materi lain tetap tersimpan.</p>{actionError&&<p role="alert" className="notice">{actionError}</p>}<div className="actions"><button className="plain-button text-link" disabled={busy} onClick={()=>dialog.current?.close()}>Batal hapus</button><button className="button danger-button" disabled={busy} onClick={()=>void remove()}>{busy?'Menghapus…':'Ya, hapus materi'}</button></div></dialog>
 </article>;
}
