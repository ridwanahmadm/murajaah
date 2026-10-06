import {describe,it,expect} from 'vitest';
import {generationInputSchema,groundDraft,validateDraft} from '../lib/generation';
import {GenerationLimiter,validAccessCode} from '../lib/ai/security';
import {OllamaProvider,createProvider,localEndpoint} from '../lib/ai/provider';
import {fixture,input} from './fixtures/draft';
describe('content integrity',()=>{
 it('overrides model book attribution with supplied reference only',()=>{const d=groundDraft(fixture(),input,[]);expect(d.lessons[0].sourceRef).toEqual({title:input.reference,locator:input.locator,url:''});});
 it('requires exact evidence for pasted sources',()=>{const d=fixture();d.questions[0].evidence='Invented source';expect(()=>groundDraft(d,input,[])).toThrow();});
 it('rejects unsourced Arabic and does not transcribe photos',()=>{const d=fixture();d.lessons[0].examples=[{arabic:'نْ',transliteration:'nun',meaning:'huruf',note:'latihan'}];expect(()=>groundDraft(d,input,[])).toThrow();expect(()=>groundDraft(d,{...input,suppliedText:'',photos:['data:image/jpeg;base64,YQ==']},[])).toThrow();expect(groundDraft(d,{...input,suppliedText:input.suppliedText+' نْ'},[]).lessons[0].examples).toHaveLength(1);});
 it('requires observed source URLs and labels ungrounded output as general',()=>{const d=fixture();d.lessons[0].sourceRef.url=d.questions[0].sourceRef.url='https://example.org/rule';const ungrounded={...input,suppliedText:''};expect(()=>groundDraft(d,ungrounded,[])).toThrow();expect(groundDraft(d,ungrounded,['https://example.org/rule']).questions[0].sourceRef.title).toContain('Rujukan umum');});
 it('rejects script URLs, bad answer indexes, orphan lessons, repeated options and missing fields',()=>{let d=fixture();d.questions[0].sourceRef.url='javascript:alert(1)';expect(()=>validateDraft(d)).toThrow();d=fixture();d.questions[0].correctIndex=4;expect(()=>validateDraft(d)).toThrow();d=fixture();d.questions[0].lessonIndex=2;expect(()=>validateDraft(d)).toThrow();d=fixture();d.questions[0].options=['sama','sama'];expect(()=>validateDraft(d)).toThrow();expect(()=>validateDraft({})).toThrow();});
 it('rejects long verbatim passages rather than publishing them',()=>{const d=fixture();const passage='Ini bagian panjang yang harus diparafrase dengan kata sendiri. '.repeat(4);d.lessons[0].explanation=passage;expect(()=>groundDraft(d,{...input,suppliedText:input.suppliedText+passage},[])).toThrow();});
 it('caps photo count and rejects non-JPEG data',()=>{expect(generationInputSchema.safeParse({...input,photos:Array(5).fill('data:image/jpeg;base64,YQ==')}).success).toBe(false);expect(generationInputSchema.safeParse({...input,photos:['https://example.org/photo.jpg']}).success).toBe(false);});
});
describe('security and adapter',()=>{
 it('rejects missing/incorrect/short codes',()=>{expect(validAccessCode(null,'a'.repeat(24))).toBe(false);expect(validAccessCode('a'.repeat(24),'a'.repeat(24))).toBe(true);expect(validAccessCode('b'.repeat(24),'a'.repeat(24))).toBe(false);expect(validAccessCode('short','short')).toBe(false);});
 it('limits concurrency, minute and hour buckets and releases after wait',()=>{const l=new GenerationLimiter();expect(l.acquire(0).allowed).toBe(true);expect(l.acquire(1).allowed).toBe(false);l.release();for(let n=1;n<3;n++){expect(l.acquire(n).allowed).toBe(true);l.release();}expect(l.acquire(3).allowed).toBe(false);for(let n=3;n<12;n++){expect(l.acquire(n*60001).allowed).toBe(true);l.release();}expect(l.acquire(800000).allowed).toBe(false);expect(l.acquire(3600001).allowed).toBe(true);});
 it('fails closed for missing config or unsupported providers',()=>{expect(()=>createProvider({})).toThrow();expect(()=>createProvider({AI_PROVIDER:'other',AI_MODEL:'env-model',AI_API_KEY:'test-only'})).toThrow();});
 it('blocks paid providers, cloud models and remote endpoints even when keys exist',()=>{
  expect(()=>createProvider({AI_PROVIDER:'openai',AI_API_KEY:'test-only',AI_MODEL:'model'})).toThrow();
  expect(()=>localEndpoint('https://api.openai.com')).toThrow();expect(()=>localEndpoint('http://remote.example:11434')).toThrow();
  expect(()=>createProvider({AI_MODEL:'qwen3.5:cloud'})).toThrow();expect(()=>createProvider({AI_MODEL:'unversioned'})).toThrow();
 });
 it('uses selected local model, strict format, and only supplied material',async()=>{
  let sent:Record<string,unknown>={};const request:typeof fetch=async(url,init)=>{
   expect(String(url)).toMatch(/^http:\/\/127\.0\.0\.1:11434\/api\/(show|chat)$/);
   expect(init?.headers).not.toHaveProperty('Authorization');
   if(String(url).endsWith('/show'))return Response.json({capabilities:['completion','vision']});
   sent=JSON.parse(String(init?.body));return Response.json({done:true,done_reason:'stop',message:{content:JSON.stringify(fixture())}});
  };const result=await new OllamaProvider('local-model:tag',undefined,request).generate(input);
  expect(sent.model).toBe('local-model:tag');expect(sent.stream).toBe(false);expect(sent.format).toBeDefined();expect(result.lessons[0].sourceRef.title).toBe(input.reference);
 });
 it('grounds free research in retrieved text and exact URLs',async()=>{
  const d=fixture();d.lessons[0].sourceRef.title=d.questions[0].sourceRef.title='Tajwid';d.lessons[0].sourceRef.locator=d.questions[0].sourceRef.locator='';d.lessons[0].sourceRef.url=d.questions[0].sourceRef.url='https://id.wikipedia.org/wiki/Tajwid';
  const request:typeof fetch=async(url)=>String(url).endsWith('/show')?Response.json({capabilities:['completion']}):Response.json({done:true,done_reason:'stop',message:{content:JSON.stringify(d)}});
  const findSources=async()=>[{title:'Tajwid',url:'https://id.wikipedia.org/wiki/Tajwid',text:input.suppliedText}];
  const result=await new OllamaProvider('local-model:tag',undefined,request,findSources).generate({...input,suppliedText:''});expect(result.lessons[0].sourceRef.title).toBe('Rujukan umum — Tajwid');expect(result.lessons[0].evidence).toBe(input.suppliedText);
 });
 it('rejects cloud aliases and model without vision before inference',async()=>{
  const remote:typeof fetch=async()=>Response.json({capabilities:['completion'],remote_host:'https://ollama.com'});
  await expect(new OllamaProvider('local-model:tag',undefined,remote).generate(input)).rejects.toThrow();
  const noVision:typeof fetch=async()=>Response.json({capabilities:['completion']});
  await expect(new OllamaProvider('local-model:tag',undefined,noVision).generate({...input,photos:['data:image/jpeg;base64,YQ==']})).rejects.toThrow();
 });
 it('rejects incomplete generation',async()=>{
  const request:typeof fetch=async(url)=>String(url).endsWith('/show')?Response.json({capabilities:['completion']}):Response.json({done:true,done_reason:'length',message:{content:'{}'}});
  await expect(new OllamaProvider('local-model:tag',undefined,request).generate(input)).rejects.toThrow();
 });
});
