import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {questions} from '../lib/seed';
test('quiz feedback, results, retry, and attempt persistence',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/kuis');await expect(page.getByRole('button',{name:'Mulai kuis'})).toBeEnabled();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Mulai kuis'}).click();
 for(let i=0;i<5;i++){
  await expect(page.getByRole('button',{name:'Periksa jawaban'})).toBeDisabled();
  const prompt=(await page.locator('.question-heading').innerText()).trim();const original=questions.find(q=>q.prompt===prompt||q.prompt.startsWith(prompt))!;
  const wrongOption=original.options.find((_,index)=>index!==original.correctIndex)!;
  await page.getByRole('radio',{name:wrongOption,exact:true}).check();await page.getByRole('button',{name:'Periksa jawaban'}).click();
  await expect(page.getByText(/Jawaban (tepat|belum tepat)/).first()).toBeVisible();
  await expect(page.getByRole('link',{name:'Pelajari materi (tab baru)'})).toHaveAttribute('href',/\/materi\/(nun|mim)/);
  if(i===0)expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.getByRole('button',{name:i===4?'Lihat hasil':'Soal berikutnya'}).click();
 }
 await expect(page.getByRole('heading',{name:'Sesi selesai'})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const retry=page.getByRole('button',{name:'Ulangi yang salah'});await expect(retry).toBeVisible();await retry.click();await expect(page.getByRole('button',{name:'Periksa jawaban'})).toBeVisible();
 await page.reload();await expect(page.getByRole('button',{name:'Mulai kuis'})).toBeEnabled();
 expect(await page.evaluate(()=>new Promise<number>((resolve,reject)=>{const request=indexedDB.open('murajaah');request.onsuccess=()=>{const database=request.result;const count=database.transaction('attempts').objectStore('attempts').count();count.onsuccess=()=>{database.close();resolve(count.result);};count.onerror=()=>reject(count.error);};request.onerror=()=>reject(request.error);}))).toBe(5);
 expect(errors).toEqual([]);
});
