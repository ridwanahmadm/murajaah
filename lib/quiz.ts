import type {Attempt, Lesson, Question, Topic} from './schema';
export function inScope(questions:Question[],lessons:Lesson[],topics:Topic[],subjectId:string,topicIds:string[],verifiedOnly=false){
 const allowedTopics=new Set(topics.filter(t=>t.subjectId===subjectId&&(!topicIds.length||topicIds.includes(t.id))).map(t=>t.id));
 const allowedLessons=new Set(lessons.filter(l=>allowedTopics.has(l.topicId)&&(!verifiedOnly||l.status==='verified')).map(l=>l.id));
 return questions.filter(q=>allowedLessons.has(q.lessonId)&&(!verifiedOnly||q.status==='verified'));
}
export function latestAttempt(id:string,attempts:Attempt[]){return attempts.filter(a=>a.questionId===id).reduce<Attempt|undefined>((last,a)=>!last||a.answeredAt>=last.answeredAt?a:last,undefined);}
export function weight(question:Question,attempts:Attempt[]){const last=latestAttempt(question.id,attempts);return !last?6:!last.correct?8:1/Math.max(1,last.box);}
export function nextBox(previous:Attempt|undefined,correct:boolean){return correct?Math.min(5,(previous?.box??0)+1):0;}
export function shuffle<T>(items:T[],random:()=>number=Math.random):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function pickQuestions(pool:Question[],count:number,attempts:Attempt[],random:()=>number=Math.random){const remaining=[...new Map(pool.map(q=>[q.id,q])).values()];const chosen:Question[]=[];while(remaining.length&&chosen.length<Math.max(0,Math.floor(count))){const total=remaining.reduce((sum,q)=>sum+weight(q,attempts),0);let target=random()*total;let index=remaining.length-1;for(let i=0;i<remaining.length;i++){target-=weight(remaining[i],attempts);if(target<0){index=i;break;}}chosen.push(remaining.splice(index,1)[0]);}return chosen.map(q=>{const options=shuffle(q.options.map((text,index)=>({text,index})),random);return {...q,options:options.map(o=>o.text),correctIndex:options.findIndex(o=>o.index===q.correctIndex)};});}

// Prefer IDs outside the prior session; finite pools may require some overlap.
export function regenerateQuestions(pool:Question[],count:number,attempts:Attempt[],previous:Question[],random:()=>number=Math.random){
 const ids=new Set(previous.map(q=>q.id));const fresh=pool.filter(q=>!ids.has(q.id));
 const first=pickQuestions(fresh,count,attempts,random);const rest=pickQuestions(pool.filter(q=>ids.has(q.id)),Math.max(0,count-first.length),attempts,random);
 const result=shuffle([...first,...rest],random);
 if(result.length>1&&result.length===previous.length&&result.every((q,i)=>q.id===previous[i].id))result.push(result.shift()!);
 return result.map(q=>{const old=previous.find(item=>item.id===q.id);if(old&&JSON.stringify(old.options)===JSON.stringify(q.options)){const options=[...q.options];options.push(options.shift()!);return {...q,options,correctIndex:(q.correctIndex+options.length-1)%options.length};}return q;});
}
