import 'fake-indexeddb/auto';
import {beforeEach,afterEach,describe,it,expect} from 'vitest';
import {db,initialize} from '../lib/db';
import {publishDraft,saveDraft,listDrafts} from '../lib/drafts';
import {groundDraft,type Draft} from '../lib/generation';
import {fixture,input} from './fixtures/draft';
const draft=():Draft=>({id:'test-draft',subjectId:'',subject:'Subjek baru',topic:'Topik baru',grounded:true,data:groundDraft(fixture(),input,[]),createdAt:1});
beforeEach(async()=>{await db.open();});
afterEach(async()=>{await db.delete();});
describe('local draft publication',()=>{
 it('persists review drafts without publishing, then atomically publishes relations',async()=>{await initialize();await saveDraft(draft());expect(await listDrafts()).toHaveLength(1);expect(await db.lessons.count()).toBe(20);const id=await publishDraft(draft(),false);expect(await db.lessons.get(id)).toMatchObject({status:'draft',origin:'ai'});expect(await db.questions.get('question-test-draft-0')).toMatchObject({lessonId:id,status:'draft'});expect(await db.subjects.get('subject-test-draft')).toBeDefined();expect(await listDrafts()).toHaveLength(0);await expect(publishDraft(draft(),true)).rejects.toThrow();expect(await db.lessons.count()).toBe(21);});
 it('requires explicit verification and never overwrites existing subjects',async()=>{await initialize();const d={...draft(),subjectId:'tahsin'};const original=await db.subjects.get('tahsin');const id=await publishDraft(d,true);expect(await db.lessons.get(id)).toMatchObject({status:'verified'});expect(await db.subjects.get('tahsin')).toEqual(original);});
 it('rolls back missing-subject publication and preserves seed edits across initialization',async()=>{await initialize();await expect(publishDraft({...draft(),subjectId:'missing'},false)).rejects.toThrow();expect(await db.lessons.count()).toBe(20);await db.lessons.update('nun',{title:'Edited title'});await initialize();expect((await db.lessons.get('nun'))?.title).toBe('Edited title');});
});
