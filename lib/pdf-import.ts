export type ExtractedPage={page:number;text:string};
export async function extractPdf(file:File,from:number,to:number,onProgress:(message:string)=>void):Promise<{pages:ExtractedPage[];total:number}>{
 if(file.size>20*1024*1024)throw new Error('PDF maksimal 20 MB.');if(!file.name.toLowerCase().endsWith('.pdf'))throw new Error('Pilih file PDF.');
 const bytes=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new Error('Isi file bukan PDF yang valid.');
 const pdf=await import('pdfjs-dist');pdf.GlobalWorkerOptions.workerSrc=`${process.env.NEXT_PUBLIC_BASE_PATH??'/'}pdf.worker.min.mjs`;
 const task=pdf.getDocument({data:bytes,useSystemFonts:true});let document;
 try{document=await task.promise;if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>document.numPages||to-from>=30)throw new Error(`Pilih maksimal 30 halaman dalam rentang 1–${document.numPages}.`);const pages:ExtractedPage[]=[];
  for(let i=from;i<=to;i++){onProgress(`Membaca halaman ${i} dari ${to}…`);const page=await document.getPage(i);const text=await page.getTextContent();let content='';for(const item of text.items){if('str' in item)content+=item.str+('hasEOL' in item&&item.hasEOL?'\n':' ');}pages.push({page:i,text:content.trim()});page.cleanup();}
  if(!pages.some(page=>page.text.length>20))throw new Error('PDF ini tidak memiliki teks yang dapat dibaca. Untuk PDF hasil scan, tempel teks hasil OCR atau gunakan foto pada AI lokal.');if(pages.reduce((sum,page)=>sum+page.text.length,0)>100000)throw new Error('Teks terlalu panjang. Pilih rentang halaman yang lebih kecil.');return {pages,total:document.numPages};
 }catch(error){if(error instanceof Error&&/password/i.test(error.name))throw new Error('PDF dilindungi kata sandi. Buka kuncinya sebelum mengimpor.');throw error;}finally{await task.destroy();}
}
