import {db} from './db';
import {lessonSchema,questionSchema,type Lesson,type Question} from './schema';
export type LessonSnapshot={lesson:Lesson;questions:Question[]};
export async function readLessonSnapshot(id:string):Promise<LessonSnapshot>{
 return db.transaction('r',[db.lessons,db.questions],async()=>{const lesson=await db.lessons.get(id);if(!lesson)throw new Error('Materi sudah dihapus.');return {lesson,questions:await db.questions.where('lessonId').equals(id).toArray()};});
}
const sorted=(questions:Question[])=>[...questions].sort((a,b)=>a.id.localeCompare(b.id));
async function assertCurrent(expected:LessonSnapshot){
 const current=await readLessonSnapshot(expected.lesson.id);
 if(JSON.stringify(current.lesson)!==JSON.stringify(expected.lesson)||JSON.stringify(sorted(current.questions))!==JSON.stringify(sorted(expected.questions)))throw new Error('Materi berubah di tab lain. Muat ulang untuk mengambil versi terbaru sebelum menyimpan.');
 return current;
}
const assessment=(q:Question)=>JSON.stringify([q.type,q.prompt,q.options,q.correctIndex]);
export async function updateLesson(expected:LessonSnapshot,raw:Lesson,rawQuestions:Question[]){
 const lesson=lessonSchema.parse(raw),questions=rawQuestions.map(q=>questionSchema.parse(q));
 if(lesson.id!==expected.lesson.id||lesson.origin!==expected.lesson.origin)throw new Error('Identitas dan asal materi tidak boleh diubah.');
 if(new Set(questions.map(q=>q.id)).size!==questions.length||questions.some(q=>q.lessonId!==lesson.id||q.status!==lesson.status))throw new Error('Relasi atau status soal tidak valid.');
 await db.transaction('rw',[db.lessons,db.questions,db.topics,db.attempts,db.readings],async()=>{
  const current=await assertCurrent(expected);
  if(!await db.topics.get(lesson.topicId))throw new Error('Topik tidak ditemukan.');
  for(const q of questions){const existing=await db.questions.get(q.id);if(existing&&(existing.lessonId!==lesson.id||existing.origin!==q.origin))throw new Error('Identitas soal tidak boleh dipindahkan.');if(!existing&&q.origin!=='manual')throw new Error('Soal baru harus berasal dari suntingan manual.');}
  const removed=current.questions.filter(q=>!questions.some(next=>next.id===q.id));
  const changed=current.questions.filter(q=>{const next=questions.find(item=>item.id===q.id);return next&&assessment(next)!==assessment(q);});
  const invalidated=[...removed,...changed].map(q=>q.id);
  if(invalidated.length)await db.attempts.where('questionId').anyOf(invalidated).delete();
  await db.questions.bulkDelete(removed.map(q=>q.id));await db.questions.bulkPut(questions);await db.lessons.put(lesson);
  if(JSON.stringify([lesson.explanation,lesson.rules,lesson.examples])!==JSON.stringify([current.lesson.explanation,current.lesson.rules,current.lesson.examples]))await db.readings.delete(lesson.id);
 });
}
export async function deleteLesson(expected:LessonSnapshot){
 await db.transaction('rw',[db.lessons,db.questions,db.attempts,db.readings],async()=>{
  const current=await assertCurrent(expected);const ids=current.questions.map(q=>q.id);
  if(ids.length)await db.attempts.where('questionId').anyOf(ids).delete();
  await db.questions.bulkDelete(ids);await db.readings.delete(current.lesson.id);await db.lessons.delete(current.lesson.id);
 });
}
