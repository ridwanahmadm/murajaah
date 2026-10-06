import Dexie, { type EntityTable } from 'dexie';
import type { Subject, Topic, Lesson, Question, Attempt, Reading } from './schema';
import * as seed from './seed';
export class MurajaahDB extends Dexie {
 subjects!:EntityTable<Subject,'id'>; topics!:EntityTable<Topic,'id'>; lessons!:EntityTable<Lesson,'id'>; questions!:EntityTable<Question,'id'>; attempts!:EntityTable<Attempt,'id'>; readings!:EntityTable<Reading,'lessonId'>; meta!:EntityTable<{key:string;value:string},'key'>;
 constructor(){super('murajaah');this.version(1).stores({subjects:'id',topics:'id,subjectId,order',lessons:'id,topicId,status',questions:'id,lessonId,status',attempts:'id,questionId,answeredAt',readings:'lessonId',meta:'key'});}
}
export const db=new MurajaahDB();
export async function initialize(){await db.transaction('rw',[db.subjects,db.topics,db.lessons,db.questions,db.meta],async()=>{if(await db.meta.get('seed-v1'))return;await db.subjects.bulkPut(seed.subjects);await db.topics.bulkPut(seed.topics);await db.lessons.bulkPut(seed.lessons);await db.questions.bulkPut(seed.questions);await db.meta.put({key:'seed-v1',value:'loaded'});});}
