import {noteSchema,noteFolderSchema} from './notes';
import {z} from 'zod';
import {db} from './db';
import {retiredTahsinKey} from './collection-storage';
import {contentKey} from './tuhfatul-athfal';
import {subjectSchema,topicSchema,lessonSchema,questionSchema} from './schema';
import {draftSchema,validateDraft,httpUrl} from './generation';
const attemptSchema=z.object({id:z.string().min(1),questionId:z.string().min(1),correct:z.boolean(),answeredAt:z.number().nonnegative(),box:z.number().int().min(0).max(5)}).strict();
const readingSchema=z.object({lessonId:z.string().min(1),completedAt:z.number().nonnegative()}).strict();
const metadataSchema=z.object({key:z.string(),value:z.string().max(250000)}).strict().refine(m=>m.key===retiredTahsinKey||m.key===contentKey||m.key==='verified-only'||m.key==='seed-v1'||m.key.startsWith('draft:')||m.key.startsWith('provenance:'),'Metadata tidak diizinkan.');
export const backupSchema=z.object({format:z.literal('murajaah'),version:z.literal(1),exportedAt:z.string().datetime(),subjects:z.array(subjectSchema).max(1000),topics:z.array(topicSchema).max(10000),lessons:z.array(lessonSchema).max(20000),questions:z.array(questionSchema).max(50000),attempts:z.array(attemptSchema).max(100000),readings:z.array(readingSchema).max(20000),noteFolders:z.array(noteFolderSchema).max(1000).default([]),notes:z.array(noteSchema).max(10000).default([]),meta:z.array(metadataSchema).max(10000)}).strict();
export type Backup=z.infer<typeof backupSchema>;
export function validateBackup(raw:unknown):Backup{
 const data=backupSchema.parse(raw);
 function unique(items:{id:string}[]){if(new Set(items.map(i=>i.id)).size!==items.length)throw new Error('ID duplikat dalam cadangan.');}
 [data.subjects,data.topics,data.lessons,data.questions,data.attempts,data.notes,data.noteFolders].forEach(unique);
 if(new Set(data.readings.map(r=>r.lessonId)).size!==data.readings.length||new Set(data.meta.map(m=>m.key)).size!==data.meta.length)throw new Error('Catatan duplikat dalam cadangan.');
 const subjects=new Set(data.subjects.map(s=>s.id)),topics=new Set(data.topics.map(t=>t.id)),lessons=new Set(data.lessons.map(l=>l.id)),questions=new Set(data.questions.map(q=>q.id));
 if(data.topics.some(t=>!subjects.has(t.subjectId))||data.lessons.some(l=>!topics.has(l.topicId))||data.questions.some(q=>!lessons.has(q.lessonId))||data.attempts.some(a=>!questions.has(a.questionId))||data.readings.some(r=>!lessons.has(r.lessonId)))throw new Error('Relasi dalam cadangan tidak lengkap. Tidak ada data yang diubah.');
 const folders=new Set(data.noteFolders.map(folder=>folder.id));if(data.notes.some(note=>note.folderId&&!folders.has(note.folderId)))throw new Error('Folder catatan dalam cadangan tidak lengkap.');
 for(const record of [...data.lessons,...data.questions])if(record.sourceRef.url)httpUrl.parse(record.sourceRef.url);
 for(const m of data.meta){
  if(m.key.startsWith('draft:')){const draft=draftSchema.parse(JSON.parse(m.value));validateDraft(draft.data);if(`draft:${draft.id}`!==m.key||draft.subjectId&&!subjects.has(draft.subjectId))throw new Error('Relasi draf tidak valid.');}
  if(m.key==='verified-only'&&!['true','false'].includes(m.value))throw new Error('Pengaturan filter tidak valid.');
  if((m.key==='seed-v1'||m.key===contentKey||m.key===retiredTahsinKey)&&m.value!=='loaded')throw new Error('Penanda materi awal tidak valid.');
  if(m.key.startsWith('provenance:'))z.object({grounded:z.boolean(),evidence:z.array(z.string().max(160)),questionEvidence:z.array(z.string().max(160))}).strict().parse(JSON.parse(m.value));
 }
 return data;
}
export async function exportBackup():Promise<Backup>{
 return db.transaction('r',[db.subjects,db.topics,db.lessons,db.questions,db.attempts,db.readings,db.notes,db.noteFolders,db.meta],async()=>validateBackup({format:'murajaah',version:1,exportedAt:new Date().toISOString(),subjects:await db.subjects.toArray(),topics:await db.topics.toArray(),lessons:await db.lessons.toArray(),questions:await db.questions.toArray(),attempts:await db.attempts.toArray(),readings:await db.readings.toArray(),notes:await db.notes.toArray(),noteFolders:await db.noteFolders.toArray(),meta:(await db.meta.toArray()).filter(m=>m.key===retiredTahsinKey||m.key===contentKey||m.key==='seed-v1'||m.key==='verified-only'||m.key.startsWith('draft:')||m.key.startsWith('provenance:'))}));
}
export async function importBackup(raw:unknown){
 const data=validateBackup(raw);
 await db.transaction('rw',[db.subjects,db.topics,db.lessons,db.questions,db.attempts,db.readings,db.notes,db.noteFolders,db.meta],async()=>{
  for(const table of [db.subjects,db.topics,db.lessons,db.questions,db.attempts,db.readings,db.notes,db.noteFolders,db.meta])await table.clear();
  await db.subjects.bulkAdd(data.subjects);await db.topics.bulkAdd(data.topics);await db.lessons.bulkAdd(data.lessons);await db.questions.bulkAdd(data.questions);await db.attempts.bulkAdd(data.attempts);await db.readings.bulkAdd(data.readings);await db.notes.bulkAdd(data.notes);await db.noteFolders.bulkAdd(data.noteFolders);await db.meta.bulkAdd(data.meta);
  // Import is the user's complete snapshot; never silently reseed an empty library.
  await db.meta.put({key:'seed-v1',value:'loaded'});
  await db.meta.put({key:contentKey,value:'loaded'});
  await db.meta.put({key:retiredTahsinKey,value:'loaded'});
 });
}
