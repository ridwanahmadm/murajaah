import type {Lesson,Topic} from './schema';
export function orderedLessons(lessons:Lesson[],topics:Topic[],subjectId:string){const order=new Map(topics.filter(t=>t.subjectId===subjectId).map(t=>[t.id,t.order]));return lessons.filter(l=>order.has(l.topicId)).sort((a,b)=>order.get(a.topicId)!-order.get(b.topicId)!||a.id.localeCompare(b.id));}
