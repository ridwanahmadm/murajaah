import 'fake-indexeddb/auto';
import {beforeEach,afterEach,describe,it,expect} from 'vitest';
import {db,initialize} from '../lib/db';
import {exportBackup,importBackup,validateBackup} from '../lib/backup';
beforeEach(async()=>{await db.open();await initialize();});afterEach(async()=>{await db.delete();});
describe('JSON backup',()=>{
 it('round trips lessons, questions, attempts and settings without secrets',async()=>{
  await db.attempts.add({id:'attempt',questionId:'q-0',correct:false,answeredAt:1,box:0});await db.readings.add({lessonId:'nun',completedAt:1});await db.meta.put({key:'verified-only',value:'true'});await db.meta.put({key:'access-code',value:'private'});
  const backup=await exportBackup();expect(JSON.stringify(backup)).not.toContain('private');await db.lessons.update('nun',{title:'changed'});await importBackup(backup);expect((await db.lessons.get('nun'))?.title).toBe('Hukum Nun Sukun & Tanwin');expect(await db.attempts.count()).toBe(1);expect(await db.meta.get('access-code')).toBeUndefined();
 });
 it('rejects malformed backups and orphan relations before mutating storage',async()=>{
  const data=await exportBackup();const invalid={...data,lessons:[]};await expect(importBackup(invalid)).rejects.toThrow();expect(await db.lessons.count()).toBe(2);expect(()=>validateBackup({...data,format:'other'})).toThrow();
 });
 it('rejects duplicate IDs, unsafe URLs and unrecognized metadata',async()=>{
  const data=await exportBackup();expect(()=>validateBackup({...data,subjects:[...data.subjects,data.subjects[0]]})).toThrow();const unsafe=structuredClone(data);unsafe.lessons[0].sourceRef.url='javascript:alert(1)';expect(()=>validateBackup(unsafe)).toThrow();expect(()=>validateBackup({...data,meta:[{key:'secret',value:'do not import'}]})).toThrow();
 });
 it('preserves intentionally empty snapshots without re-seeding',async()=>{
  await importBackup({format:'murajaah',version:1,exportedAt:new Date().toISOString(),subjects:[],topics:[],lessons:[],questions:[],attempts:[],readings:[],meta:[]});await initialize();expect(await db.lessons.count()).toBe(0);
 });
});
