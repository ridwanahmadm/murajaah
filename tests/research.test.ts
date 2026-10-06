import {it,expect} from 'vitest';
import {research} from '../lib/ai/research';
it('retrieves free sources only from fixed Wikipedia hosts',async()=>{
 const seen:string[]=[];const request:typeof fetch=async url=>{const target=new URL(String(url));seen.push(target.hostname);return target.searchParams.get('list')==='search'?Response.json({query:{search:[{pageid:1,title:'Tajwid'}]}}):Response.json({query:{pages:[{title:'Tajwid',fullurl:'https://id.wikipedia.org/wiki/Tajwid',extract:'Tajwid mempelajari kaidah membaca. '.repeat(5)}]}});};
 const result=await research('Tajwid http://127.0.0.1/private','Tahsin',request);expect(result).toHaveLength(1);expect(seen).toEqual(['id.wikipedia.org','id.wikipedia.org']);
});
it('does not treat arbitrary source links as fetched research',async()=>{
 const request:typeof fetch=async url=>new URL(String(url)).searchParams.get('list')==='search'?Response.json({query:{search:[{pageid:1,title:'bad'}]}}):Response.json({query:{pages:[{title:'bad',fullurl:'http://localhost/private',extract:'x'.repeat(100)}]}});
 await expect(research('topic','subject',request)).rejects.toThrow();
});
