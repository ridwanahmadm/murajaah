import {z} from 'zod';
import {db} from './db';
export const noteSchema=z.object({id:z.string().min(1).max(200),title:z.string().trim().min(1).max(160),speaker:z.string().trim().max(160),date:z.iso.date(),reference:z.string().trim().max(1000),content:z.string().trim().min(1).max(100000),updatedAt:z.number().nonnegative()}).strict();
export type StudyNote=z.infer<typeof noteSchema>;
export async function saveNote(value:StudyNote){const note=noteSchema.parse(value);await db.notes.put(note);}
export async function deleteNote(id:string){await db.notes.delete(id);}
