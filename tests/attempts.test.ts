import 'fake-indexeddb/auto';
import {beforeEach,afterEach,it,expect} from 'vitest';
import {db,initialize} from '../lib/db';
import {saveAttempt} from '../lib/attempts';
import {pickQuestions} from '../lib/quiz';
import {readLessonSnapshot,deleteLesson} from '../lib/lessons';
beforeEach(async()=>{await db.open();await initialize();});afterEach(async()=>{await db.delete();});
it('accepts an unchanged question with shuffled options',async()=>{const original=(await db.questions.get('q-0'))!;const q=pickQuestions([original],1,[],()=>0)[0];await saveAttempt(q,{id:'a',questionId:q.id,correct:true,answeredAt:1,box:1});expect(await db.attempts.count()).toBe(1);});
it('rejects answering a deleted or changed question without orphan history',async()=>{const q=(await db.questions.get('q-0'))!;await db.questions.update(q.id,{correctIndex:1});await expect(saveAttempt(q,{id:'a',questionId:q.id,correct:true,answeredAt:1,box:1})).rejects.toThrow('diubah');await deleteLesson(await readLessonSnapshot('nun'));await expect(saveAttempt(q,{id:'b',questionId:q.id,correct:true,answeredAt:1,box:1})).rejects.toThrow('dihapus');expect(await db.attempts.count()).toBe(0);});
