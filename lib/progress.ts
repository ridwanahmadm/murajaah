import {db} from './db';
export async function setReading(id:string,done:boolean){await db.transaction('rw',[db.lessons,db.readings],async()=>{if(!await db.lessons.get(id))throw new Error('Materi sudah dihapus.');if(done)await db.readings.put({lessonId:id,completedAt:Date.now()});else await db.readings.delete(id);});}
// Reset only learning history, never the library or draft content.
export async function resetProgress(subjectId?:string){
 await db.transaction('rw',[db.subjects,db.topics,db.lessons,db.questions,db.readings,db.attempts],async()=>{
  if(!subjectId){await db.readings.clear();await db.attempts.clear();return;}
  if(!await db.subjects.get(subjectId))throw new Error('Koleksi tidak ditemukan.');
  const topics=await db.topics.where('subjectId').equals(subjectId).toArray();const lessons=topics.length?await db.lessons.where('topicId').anyOf(topics.map(t=>t.id)).toArray():[];
  const ids=lessons.map(l=>l.id);if(!ids.length)return;const questions=await db.questions.where('lessonId').anyOf(ids).toArray();
  await db.readings.bulkDelete(ids);if(questions.length)await db.attempts.where('questionId').anyOf(questions.map(q=>q.id)).delete();
 });
}
