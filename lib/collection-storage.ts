import type {MurajaahDB} from './db';
// Called inside a transaction containing every table in the learning graph.
export async function removeLessons(database:MurajaahDB,ids:string[]){
 if(!ids.length)return;
 const questions=await database.questions.where('lessonId').anyOf(ids).toArray();
 const questionIds=questions.map(q=>q.id);
 if(questionIds.length)await database.attempts.where('questionId').anyOf(questionIds).delete();
 await database.questions.bulkDelete(questionIds);await database.readings.bulkDelete(ids);await database.lessons.bulkDelete(ids);
}
export async function removeSubject(database:MurajaahDB,id:string){
 const topics=await database.topics.where('subjectId').equals(id).toArray();
 const lessons=topics.length?await database.lessons.where('topicId').anyOf(topics.map(t=>t.id)).toArray():[];
 await removeLessons(database,lessons.map(l=>l.id));
 for(const record of await database.meta.toArray()){
  if(record.key.startsWith('draft:')){try{if(JSON.parse(record.value).subjectId===id)await database.meta.delete(record.key);}catch{/* Invalid drafts are not published data. */}}
 }
 for(const t of topics)if(t.id.startsWith('topic-'))await database.meta.delete(`provenance:${t.id.slice(6)}`);
 await database.topics.bulkDelete(topics.map(t=>t.id));await database.subjects.delete(id);
}
export const retiredTahsinKey='migration:remove-tahsin-v1';
