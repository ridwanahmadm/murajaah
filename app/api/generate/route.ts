import {generationInputSchema} from '@/lib/generation';
import {AIError,createProvider} from '@/lib/ai/provider';
import {GenerationLimiter,validAccessCode} from '@/lib/ai/security';
export const runtime='nodejs';
export const maxDuration=300;
const limiter=new GenerationLimiter();
function reply(body:unknown,status=200,extra:Record<string,string>={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...extra}});}
export async function POST(request:Request){
 if(!process.env.APP_ACCESS_CODE||process.env.APP_ACCESS_CODE.length<24)return reply({error:'Kode akses server belum dikonfigurasi (minimal 24 karakter).'},503);
 if(!validAccessCode(request.headers.get('x-access-code'),process.env.APP_ACCESS_CODE))return reply({error:'Kode akses tidak sesuai. Periksa Pengaturan.'},401);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Permintaan harus berasal dari aplikasi ini.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Format permintaan harus JSON.'},415);
 const reader=request.body?.getReader();if(!reader)return reply({error:'Materi belum tersedia.'},400);
 const chunks:Uint8Array[]=[];let bytes=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>3200000){await reader.cancel();return reply({error:'Materi terlalu besar. Kurangi jumlah foto atau teks.'},413);}chunks.push(value);}}catch{return reply({error:'Materi tidak dapat dibaca.'},400);}
 let raw:unknown;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return reply({error:'JSON permintaan tidak valid.'},400);}
 const input=generationInputSchema.safeParse(raw);if(!input.success)return reply({error:'Periksa topik, referensi, teks, dan maksimal empat foto JPEG.'},400);
 let provider;try{provider=createProvider();}catch(error){return reply({error:error instanceof AIError?error.message:'Konfigurasi AI lokal belum siap.'},503);}
 const limit=limiter.acquire();if(!limit.allowed)return reply({error:'Batas permintaan tercapai. Tunggu sebelum membuat draf lagi.'},429,{'Retry-After':String(limit.retryAfter)});
 try{return reply({data:await provider.generate(input.data),grounded:!!(input.data.suppliedText||input.data.photos.length)});}
 catch(error){return reply({error:error instanceof AIError?error.message:'Draf tidak dapat divalidasi atau sumber belum cukup. Coba materi yang lebih singkat dan jelas; tidak ada materi yang diterbitkan.'},error instanceof AIError?error.status:502);}
 finally{limiter.release();}
}
