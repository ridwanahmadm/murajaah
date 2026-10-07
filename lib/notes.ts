import {z} from 'zod';
import {db} from './db';
export const noteSchema=z.object({id:z.string().min(1).max(200),title:z.string().trim().min(1).max(160),folderId:z.string().max(200).optional(),speaker:z.string().trim().max(160),date:z.iso.date(),reference:z.string().trim().max(1000),content:z.string().trim().min(1).max(100000),updatedAt:z.number().nonnegative()}).strict();
export type StudyNote=z.infer<typeof noteSchema>;
export async function saveNote(value:StudyNote){const note=noteSchema.parse(value);await db.transaction('rw',[db.notes,db.noteFolders],async()=>{if(note.folderId&&!await db.noteFolders.get(note.folderId))throw new Error('Folder tidak ditemukan. Pilih folder lain.');await db.notes.put(note);});}
export async function deleteNote(id:string){await db.notes.delete(id);}
export const noteFolderSchema=z.object({id:z.string().min(1).max(200),title:z.string().trim().min(1).max(120),updatedAt:z.number().nonnegative()}).strict();
export type NoteFolder=z.infer<typeof noteFolderSchema>;
export async function saveNoteFolder(value:NoteFolder){const folder=noteFolderSchema.parse(value);await db.transaction('rw',db.noteFolders,async()=>{const folders=await db.noteFolders.toArray();if(folders.some(item=>item.id!==folder.id&&item.title.toLocaleLowerCase('id-ID')===folder.title.toLocaleLowerCase('id-ID')))throw new Error('Nama folder sudah digunakan. Pilih nama lain.');await db.noteFolders.put(folder);});}
export async function deleteNoteFolder(id:string){await db.transaction('rw',[db.notes,db.noteFolders],async()=>{await db.notes.where('folderId').equals(id).modify({folderId:''});await db.noteFolders.delete(id);});}
