import {describe,it,expect} from 'vitest';
import {inScope,pickQuestions,weight,nextBox,latestAttempt} from '../lib/quiz';
import {questions,lessons,topics} from '../lib/seed';
import type {Attempt} from '../lib/schema';
const attempt=(correct:boolean,time:number,box=1):Attempt=>({id:String(time),questionId:'q-0',correct,answeredAt:time,box});
describe('quiz engine',()=>{
 it('restricts subjects, topics, and verified provenance',()=>{expect(inScope(questions,lessons,topics,'other',[])).toHaveLength(0);expect(inScope(questions,lessons,topics,'tahsin',['tahsin-2'])).toHaveLength(5);expect(inScope(questions,lessons,topics,'tahsin',[],true)).toHaveLength(0);});
 it('does not repeat or mutate even when asked for more than available',()=>{const original=JSON.stringify(questions);const result=pickQuestions([...questions,questions[0]],20,[],()=>0.3);expect(result).toHaveLength(10);expect(new Set(result.map(q=>q.id)).size).toBe(10);expect(JSON.stringify(questions)).toBe(original);expect(pickQuestions([],5,[])).toEqual([]);});
 it('preserves correct answer after option shuffle',()=>{pickQuestions(questions,10,[],()=>0).forEach(q=>expect(q.options[q.correctIndex]).toBe(questions.find(original=>original.id===q.id)!.options[0]));});
 it('weights unseen and most recently wrong higher than established answers',()=>{expect(weight(questions[0],[])).toBeGreaterThan(weight(questions[0],[attempt(true,1,5)]));expect(weight(questions[0],[attempt(true,2,5),attempt(false,3)])).toBe(8);expect(latestAttempt('q-0',[attempt(false,3),attempt(true,2)])?.correct).toBe(false);});
 it('advances boxes and resets after errors',()=>{expect(nextBox(undefined,true)).toBe(1);expect(nextBox(attempt(true,1,5),true)).toBe(5);expect(nextBox(attempt(true,1,4),false)).toBe(0);});
});
