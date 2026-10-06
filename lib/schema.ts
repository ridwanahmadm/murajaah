import { z } from 'zod';
export const sourceSchema = z.object({title:z.string(),locator:z.string(),url:z.string().url().optional()});
const provenance = {origin:z.enum(['seed','ai','manual']),status:z.enum(['draft','verified']),sourceRef:sourceSchema};
export const subjectSchema=z.object({id:z.string(),title:z.string(),description:z.string(),reference:z.string()});
export const topicSchema=z.object({id:z.string(),subjectId:z.string(),title:z.string(),order:z.number()});
export const lessonSchema=z.object({id:z.string(),topicId:z.string(),title:z.string(),explanation:z.string(),rules:z.array(z.object({name:z.string(),description:z.string()})),examples:z.array(z.object({arabic:z.string(),transliteration:z.string(),meaning:z.string(),note:z.string()})),...provenance});
export const questionSchema=z.object({id:z.string(),lessonId:z.string(),type:z.enum(['multiple-choice','true-false','identify-rule']),prompt:z.string(),options:z.array(z.string()).min(2),correctIndex:z.number().int().nonnegative(),explanation:z.string(),...provenance}).refine(q=>q.correctIndex<q.options.length,'Invalid answer index');
export type Subject=z.infer<typeof subjectSchema>;
export type Topic=z.infer<typeof topicSchema>;
export type Lesson=z.infer<typeof lessonSchema>;
export type Question=z.infer<typeof questionSchema>;
export interface Attempt {id:string;questionId:string;correct:boolean;answeredAt:number;box:number}
export interface Reading {lessonId:string;completedAt:number}
