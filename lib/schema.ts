import {z} from 'zod';
const id=z.string().trim().min(1).max(200);
const short=z.string().trim().min(1).max(2000);
const http=z.string().url().refine(url=>['http:','https:'].includes(new URL(url).protocol),'Gunakan URL http atau https.');
export const sourceSchema=z.object({title:short,locator:z.string().max(160),url:http.optional(),document:z.literal('tuhfatul-athfal').optional(),pdfPage:z.number().int().min(1).max(31).optional()});
const provenance={origin:z.enum(['seed','ai','manual']),status:z.enum(['draft','verified']),sourceRef:sourceSchema};
export const subjectSchema=z.object({id,title:short,description:short,reference:short});
export const topicSchema=z.object({id,subjectId:id,title:short,order:z.number().int().nonnegative()});
export const lessonSchema=z.object({id,topicId:id,title:short,explanation:short,rules:z.array(z.object({name:short,description:short})).min(1).max(8),examples:z.array(z.object({arabic:short,transliteration:short,meaning:short,note:short})).max(4),...provenance});
export const questionSchema=z.object({id,lessonId:id,type:z.enum(['multiple-choice','true-false','identify-rule']),prompt:short,options:z.array(short).min(2).max(5),correctIndex:z.number().int().nonnegative(),explanation:short,...provenance}).refine(q=>q.correctIndex<q.options.length&&new Set(q.options).size===q.options.length,'Jawaban atau pilihan tidak valid.').refine(q=>q.type!=='true-false'||q.options.length===2&&q.options.includes('Benar')&&q.options.includes('Salah'),'Soal benar/salah harus menggunakan Benar dan Salah.');
export type Subject=z.infer<typeof subjectSchema>;
export type Topic=z.infer<typeof topicSchema>;
export type Lesson=z.infer<typeof lessonSchema>;
export type Question=z.infer<typeof questionSchema>;
export interface Attempt{id:string;questionId:string;correct:boolean;answeredAt:number;box:number}
export interface Reading{lessonId:string;completedAt:number}
