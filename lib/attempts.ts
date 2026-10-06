import {db} from './db';
import type {Attempt,Question} from './schema';
export async function saveAttempt(question:Question,attempt:Attempt){
 await db.transaction('rw',[db.questions,db.lessons,db.attempts],async()=>{
  const current=await db.questions.get(question.id);
  if(!current||!await db.lessons.get(current.lessonId)||current.type!==question.type||current.prompt!==question.prompt||current.lessonId!==question.lessonId||JSON.stringify([...current.options].sort())!==JSON.stringify([...question.options].sort())||current.options[current.correctIndex]!==question.options[question.correctIndex])throw new Error('Soal telah diubah atau dihapus di tab lain. Atur sesi baru untuk melanjutkan.');
  await db.attempts.add(attempt);
 });
}
