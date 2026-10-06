import {z} from 'zod';
export const researchSourceSchema=z.object({title:z.string(),url:z.string().url(),text:z.string().min(80)});
export type ResearchSource=z.infer<typeof researchSourceSchema>;
const searchSchema=z.object({query:z.object({search:z.array(z.object({pageid:z.number(),title:z.string()}))}).optional()});
const extractSchema=z.object({query:z.object({pages:z.array(z.object({title:z.string(),fullurl:z.string(),extract:z.string().optional()}))}).optional()});
// Fixed public hosts only: user URLs can never become arbitrary server fetch targets.
export async function research(topic:string,subject:string,request:typeof fetch=fetch):Promise<ResearchSource[]>{
 const headers={'User-Agent':'Murajaah/1.0 (personal learning app; source-linked drafts)'};
 for(const [language,query] of [['id',`${topic} ${subject}`],['id',topic],['en',`${topic} ${subject}`],['en',topic]]){
  const base=`https://${language}.wikipedia.org/w/api.php`;
  const searchUrl=new URL(base);searchUrl.search=new URLSearchParams({action:'query',list:'search',srsearch:query,srlimit:'3',format:'json',formatversion:'2'}).toString();
  const result=await request(searchUrl,{headers,redirect:'error',signal:AbortSignal.timeout(15000)});if(!result.ok)throw new Error('Riset gratis belum tersedia. Tempel teks sumber untuk melanjutkan.');
  const matches=searchSchema.parse(await result.json()).query?.search??[];if(!matches.length)continue;
  const extractUrl=new URL(base);extractUrl.search=new URLSearchParams({action:'query',prop:'extracts|info',inprop:'url',pageids:matches.map(p=>p.pageid).join('|'),explaintext:'1',exchars:'10000',format:'json',formatversion:'2'}).toString();
  const extracted=await request(extractUrl,{headers,redirect:'error',signal:AbortSignal.timeout(15000)});if(!extracted.ok)throw new Error('Sumber riset belum dapat dibaca.');
  const pages=extractSchema.parse(await extracted.json()).query?.pages??[];
  const sources=pages.flatMap(p=>{const parsed=researchSourceSchema.safeParse({title:p.title,url:p.fullurl,text:(p.extract??'').slice(0,10000)});if(!parsed.success||new URL(parsed.data.url).hostname!==`${language}.wikipedia.org`)return [];return [parsed.data];});
  if(sources.length)return sources;
 }
 throw new Error('Belum ditemukan rujukan gratis yang sesuai. Tempel teks atau unggah foto sumber.');
}
