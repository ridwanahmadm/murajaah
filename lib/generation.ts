import { z } from 'zod';
const text = z.string().trim().min(1).max(2000);
export const httpUrl = z.string().url().refine(value => ['http:', 'https:'].includes(new URL(value).protocol), 'Gunakan URL http atau https.');
export const generationInputSchema = z.object({
  subject: z.string().trim().min(1).max(120),
  topic: z.string().trim().min(1).max(160),
  reference: z.string().trim().min(1).max(1000),
  locator: z.string().trim().max(160),
  suppliedText: z.string().trim().max(16000),
  photos: z.array(z.string().max(750000).regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/)).max(4),
}).strict();
const aiSource = z.object({ title: text, locator: z.string().max(160), url: z.string().max(2048) }).strict();
// Structural schema is sent as strict JSON Schema; semantic constraints are checked afterwards.
export const aiDraftSchema = z.object({
  lessons: z.array(z.object({
    title: text, explanation: text,
    rules: z.array(z.object({ name: text, description: text }).strict()).min(1).max(8),
    examples: z.array(z.object({ arabic: z.string().max(48), transliteration: text, meaning: text, note: text }).strict()).max(4),
    sourceRef: aiSource, evidence: z.string().max(160),
  }).strict()).min(1).max(60),
  questions: z.array(z.object({
    lessonIndex: z.number().int().min(0).max(59),
    type: z.enum(['multiple-choice', 'true-false', 'identify-rule']),
    prompt: text, options: z.array(text).min(2).max(5), correctIndex: z.number().int().min(0).max(4),
    explanation: text, sourceRef: aiSource, evidence: z.string().max(160),
  }).strict()).min(0).max(100),
}).strict();
export type GenerationInput = z.infer<typeof generationInputSchema>;
export type AIDraft = z.infer<typeof aiDraftSchema>;
export const replySchema=z.object({data:aiDraftSchema,grounded:z.boolean()});
export const draftSchema = z.object({
  id: z.string().min(1), subjectId: z.string(), subject: z.string().trim().min(1).max(120), topic: z.string().trim().min(1).max(160),
  grounded: z.boolean(), origin:z.enum(['ai','manual']).optional(), data: aiDraftSchema, createdAt: z.number(),
});
export type Draft = z.infer<typeof draftSchema>;
const hasArabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
export function validateDraft(value: unknown): AIDraft {
  const data = aiDraftSchema.parse(value);
  for (const q of data.questions) {
    if (!data.lessons[q.lessonIndex] || q.correctIndex >= q.options.length) throw new Error('Relasi soal atau jawaban tidak valid.');
    if (new Set(q.options).size !== q.options.length) throw new Error('Pilihan jawaban harus berbeda.');
    if(q.type==='true-false'&&(q.options.length!==2||!q.options.includes('Benar')||!q.options.includes('Salah'))) throw new Error('Soal benar/salah harus memakai pilihan Benar dan Salah.');
  }
  for (const item of [...data.lessons, ...data.questions]) if (item.sourceRef.url) httpUrl.parse(item.sourceRef.url);
  return data;
}
export function requireParaphrase(data:AIDraft,source:string){
 if(!source)return;const normalizedSource=source.normalize('NFC');
 const prose=[...data.lessons.flatMap(l=>[l.title,l.explanation,...l.rules.flatMap(r=>[r.name,r.description]),...l.examples.flatMap(e=>[e.transliteration,e.meaning,e.note])]),...data.questions.flatMap(q=>[q.prompt,q.explanation,...q.options])];
 for(const text of prose){const normalized=text.normalize('NFC');for(let i=0;i+180<=normalized.length;i+=20)if(normalizedSource.includes(normalized.slice(i,i+180)))throw new Error('Draf menyalin bagian sumber terlalu panjang. Parafrase diperlukan.');}
}
export function groundDraft(value: unknown, input: GenerationInput, sourceUrls: string[]): AIDraft {
  const data = validateDraft(value);
  const grounded = !!(input.suppliedText || input.photos.length);
  const supplied = input.suppliedText.normalize('NFC');
  requireParaphrase(data,supplied);
  for (const lesson of data.lessons) {
    for (const example of lesson.examples) {
      // Never trust model-produced verse text or OCR as a verified Quran provider.
      if (!example.arabic || !supplied.includes(example.arabic.normalize('NFC'))) throw new Error('Contoh Arab harus berasal dari teks yang Anda tempel.');
    }
  }
  for (const item of [...data.lessons, ...data.questions]) {
    const prose = 'rules' in item ? [item.title, item.explanation, ...item.rules.flatMap(r=>[r.name,r.description]), ...item.examples.flatMap(e=>[e.transliteration,e.meaning,e.note])] : [item.prompt, item.explanation, ...item.options];
    // Prose and prompts stay Indonesian; Arabic is isolated in pasted example fields.

    if(prose.some(s=>hasArabic.test(s))) throw new Error('Teks Arab hanya boleh berada pada contoh yang ditempel pengguna.');
    if(hasArabic.test(item.evidence)&&!supplied.includes(item.evidence.normalize('NFC')))throw new Error('Bukti Arab harus berasal dari teks yang ditempel pengguna.');
    if (grounded) {
      if (!item.evidence.trim()) throw new Error('Bukti sumber materi belum tersedia.');
      if (input.suppliedText && !input.photos.length && !supplied.includes(item.evidence.normalize('NFC'))) throw new Error('Bukti tidak ditemukan dalam teks yang Anda berikan.');
      item.sourceRef = { title: input.reference, locator: input.locator, url: '' };
    } else {
      if (!item.sourceRef.url || !sourceUrls.includes(item.sourceRef.url)) throw new Error('Rujukan umum harus memakai URL yang ditemukan dalam pencarian.');
      item.sourceRef = { title: `Rujukan umum — ${item.sourceRef.title}`, locator: '', url: item.sourceRef.url };
    }
  }
  return data;
}
