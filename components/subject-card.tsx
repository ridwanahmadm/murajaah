"use client";
import Link from 'next/link';
import type {Subject} from '@/lib/schema';
import {useLibrary} from './library-provider';
import {DeletionControls} from './deletion-controls';
export function SubjectCard({subject,manage=false}:{subject:Subject;manage?:boolean}){
 const Heading=manage?'h2':'h3';
 const {lessons,topics,readings}=useLibrary();const entries=lessons.filter(l=>topics.some(t=>t.id===l.topicId&&t.subjectId===subject.id));const completed=entries.filter(l=>readings.some(r=>r.lessonId===l.id)).length;
 return <div className="card subject-card"><Link className="card-body" href={`/materi/koleksi/${encodeURIComponent(subject.id)}`}><p className="eyebrow">MATERI BELAJAR</p><Heading>{subject.title}</Heading><p>{subject.description}</p><div className="progress" role="progressbar" aria-label={`Kemajuan ${subject.title}`} aria-valuemin={0} aria-valuemax={Math.max(1,entries.length)} aria-valuenow={completed}><span style={{width:`${entries.length?completed/entries.length*100:0}%`}}/></div><small>{completed} dari {entries.length} pelajaran dibaca</small></Link>{manage&&<DeletionControls scope={{kind:'subject',id:subject.id}} label={`Hapus koleksi ${subject.title}`}/>}</div>;
}
