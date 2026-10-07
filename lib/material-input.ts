import type {Draft,AIDraft} from './generation';
export function manualDraft(input:{subjectId:string;subject:string;topic:string;reference:string;locator:string;text:string}):Draft{
 const text=input.text.trim();if(!text)throw new Error('Isi teks materi atau baca PDF terlebih dahulu.');if(text.length>100000)throw new Error('Teks maksimal 100.000 karakter.');
 const chunks:string[]=[];let rest=text;while(rest.length){let size=Math.min(1900,rest.length);if(size<rest.length){const boundary=rest.lastIndexOf('\n',size);if(boundary>500)size=boundary;}chunks.push(rest.slice(0,size).trim());rest=rest.slice(size).trim();}
 const sourceRef={title:input.reference,locator:input.locator,url:''};const data:AIDraft={lessons:chunks.map((chunk,index)=>({title:chunks.length===1?input.topic:`${input.topic} · Bagian ${index+1}`,explanation:chunk,rules:[{name:'Pokok materi',description:chunk}],examples:[],sourceRef,evidence:''})),questions:[]};
 return {id:crypto.randomUUID(),subjectId:input.subjectId,subject:input.subject,topic:input.topic,grounded:true,origin:'manual',createdAt:Date.now(),data};
}
