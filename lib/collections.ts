import {db} from './db';
import {removeLessons,removeSubject} from './collection-storage';
export type DeletionScope={kind:'subject';id:string}|{kind:'lessons';ids:string[];subjectId:string};
export type DeletionPreview={scope:DeletionScope;title:string;topics:number;lessons:number;questions:number;attempts:number;readings:number;drafts:number;signature:string};
const tables=()=>[db.subjects,db.topics,db.lessons,db.questions,db.attempts,db.readings,db.meta];
async function preview(scope:DeletionScope):Promise<DeletionPreview>{
 const subjectId=scope.kind==='subject'?scope.id:scope.subjectId;const subject=await db.subjects.get(subjectId);if(!subject)throw new Error('Koleksi tidak ditemukan.');
 const topics=await db.topics.where('subjectId').equals(subjectId).toArray();
 const allLessons=topics.length?await db.lessons.where('topicId').anyOf(topics.map(t=>t.id)).toArray():[];
 const lessons=scope.kind==='subject'?allLessons:allLessons.filter(l=>scope.ids.includes(l.id));
 if(scope.kind==='lessons'&&(!scope.ids.length||new Set(scope.ids).size!==scope.ids.length||lessons.length!==scope.ids.length))throw new Error('Pilihan pelajaran tidak valid atau telah berubah.');
 const ids=lessons.map(l=>l.id);const questions=ids.length?await db.questions.where('lessonId').anyOf(ids).toArray():[];
 const attempts=questions.length?await db.attempts.where('questionId').anyOf(questions.map(q=>q.id)).toArray():[];
 const readings=ids.length?await db.readings.where('lessonId').anyOf(ids).toArray():[];
 const drafts=scope.kind==='subject'?(await db.meta.where('key').startsWith('draft:').toArray()).filter(m=>{try{return JSON.parse(m.value).subjectId===subjectId;}catch{return false;}}):[];
 const order=<T>(items:T[])=>items.map(item=>JSON.stringify(item)).sort();
 return {scope,title:scope.kind==='subject'?subject.title:`${lessons.length} pelajaran dari ${subject.title}`,topics:scope.kind==='subject'?topics.length:0,lessons:lessons.length,questions:questions.length,attempts:attempts.length,readings:readings.length,drafts:drafts.length,signature:JSON.stringify([subject,order(scope.kind==='subject'?topics:[]),order(lessons),order(questions),order(attempts),order(readings),order(drafts)])};
}
export async function previewDeletion(scope:DeletionScope){return db.transaction('r',tables(),()=>preview(scope));}
export async function confirmDeletion(expected:DeletionPreview,confirmation:string){
 if(confirmation!=='HAPUS')throw new Error('Ketik HAPUS untuk mengonfirmasi penghapusan.');
 await db.transaction('rw',tables(),async()=>{
  const current=await preview(expected.scope);if(current.signature!==expected.signature)throw new Error('Data berubah di tab lain. Batalkan lalu periksa ringkasan penghapusan kembali.');
  if(expected.scope.kind==='subject')await removeSubject(db,expected.scope.id);else await removeLessons(db,expected.scope.ids);
 });
}
