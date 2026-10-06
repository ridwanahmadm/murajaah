import {db} from './db';
import {draftSchema,validateDraft,type Draft} from './generation';
import {lessonSchema,questionSchema,subjectSchema,topicSchema} from './schema';
export async function saveDraft(draft:Draft){draftSchema.parse(draft);validateDraft(draft.data);await db.meta.put({key:`draft:${draft.id}`,value:JSON.stringify(draft)});}
export async function listDrafts(){const records=await db.meta.where('key').startsWith('draft:').toArray();return records.flatMap(record=>{try{return [draftSchema.parse(JSON.parse(record.value))];}catch{return [];}}).sort((a,b)=>b.createdAt-a.createdAt);}
export async function publishDraft(value:Draft,verified:boolean){
 const draft=draftSchema.parse(value);const data=validateDraft(draft.data);
 const subjectId=draft.subjectId||`subject-${draft.id}`;const topicId=`topic-${draft.id}`;
 const lessonIds=data.lessons.map((_,index)=>`lesson-${draft.id}-${index}`);
 const status=verified?'verified' as const:'draft' as const;
 // Provenance is explicit; AI never writes IDs, origin or verification status.
 const lessons=data.lessons.map((l,index)=>lessonSchema.parse({id:lessonIds[index],topicId,title:l.title,explanation:l.explanation,rules:l.rules,examples:l.examples,origin:'ai',status,sourceRef:{...l.sourceRef,url:l.sourceRef.url||undefined}}));
 const questions=data.questions.map((q,index)=>questionSchema.parse({id:`question-${draft.id}-${index}`,lessonId:lessonIds[q.lessonIndex],type:q.type,prompt:q.prompt,options:q.options,correctIndex:q.correctIndex,explanation:q.explanation,origin:'ai',status,sourceRef:{...q.sourceRef,url:q.sourceRef.url||undefined}}));
 await db.transaction('rw',[db.subjects,db.topics,db.lessons,db.questions,db.meta],async()=>{
  if(await db.topics.get(topicId))throw new Error('Draf ini sudah diterbitkan.');
  if(draft.subjectId){if(!await db.subjects.get(subjectId))throw new Error('Subjek tidak ditemukan.');}
  else await db.subjects.add(subjectSchema.parse({id:subjectId,title:draft.subject,description:'Materi yang Anda tinjau untuk dipelajari kembali.',reference:draft.grounded?data.lessons[0].sourceRef.title:'Rujukan umum'}));
  const siblings=await db.topics.where('subjectId').equals(subjectId).toArray();
  await db.topics.add(topicSchema.parse({id:topicId,subjectId,title:draft.topic,order:Math.max(-1,...siblings.map(t=>t.order))+1}));
  await db.lessons.bulkAdd(lessons);await db.questions.bulkAdd(questions);
  await db.meta.put({key:`provenance:${draft.id}`,value:JSON.stringify({grounded:draft.grounded,evidence:data.lessons.map(l=>l.evidence),questionEvidence:data.questions.map(q=>q.evidence)})});
  await db.meta.delete(`draft:${draft.id}`);
 });
 return lessonIds[0];
}
