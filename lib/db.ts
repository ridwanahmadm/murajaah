import type {StudyNote} from './notes';
import Dexie, { type EntityTable } from 'dexie';
import type { Subject, Topic, Lesson, Question, Attempt, Reading } from './schema';
import {removeSubject,retiredTahsinKey} from './collection-storage';
import {contentKey,pdfSubject,pdfTopics,pdfLessons,pdfQuestions} from './tuhfatul-athfal';
export class MurajaahDB extends Dexie {
 notes!:EntityTable<StudyNote,'id'>; subjects!:EntityTable<Subject,'id'>; topics!:EntityTable<Topic,'id'>; lessons!:EntityTable<Lesson,'id'>; questions!:EntityTable<Question,'id'>; attempts!:EntityTable<Attempt,'id'>; readings!:EntityTable<Reading,'lessonId'>; meta!:EntityTable<{key:string;value:string},'key'>;
 constructor(){super('murajaah');this.version(1).stores({subjects:'id',topics:'id,subjectId,order',lessons:'id,topicId,status',questions:'id,lessonId,status',attempts:'id,questionId,answeredAt',readings:'lessonId',meta:'key'});this.version(2).stores({notes:'id,title,date,updatedAt'});}
}
export const db=new MurajaahDB();
export async function initialize(){await db.transaction('rw',[db.subjects,db.topics,db.lessons,db.questions,db.attempts,db.readings,db.meta],async()=>{
 if(!await db.meta.get('seed-v1'))await db.meta.put({key:'seed-v1',value:'loaded'});
 if(!await db.meta.get(retiredTahsinKey)){await removeSubject(db,'tahsin');await db.meta.put({key:retiredTahsinKey,value:'loaded'});}
 if(!await db.meta.get(contentKey)){
  if(!await db.subjects.get(pdfSubject.id)){await db.subjects.add(pdfSubject);await db.topics.bulkAdd(pdfTopics);await db.lessons.bulkAdd(pdfLessons);await db.questions.bulkAdd(pdfQuestions);}
  await db.meta.put({key:contentKey,value:'loaded'});
 }
 });}
