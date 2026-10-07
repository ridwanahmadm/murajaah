import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {pdfQuestions as questions} from '../lib/tuhfatul-athfal';
test('quiz feedback, results, retry, and attempt persistence',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/kuis');await page.getByRole('button',{name:'Siapkan kuis'}).click();await expect(page.getByRole('button',{name:'Mulai kuis'})).toBeEnabled();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Mulai kuis'}).click();
 for(let i=0;i<5;i++){
  await expect(page.getByRole('button',{name:'Periksa jawaban'})).toBeDisabled();
  const prompt=(await page.locator('.question-heading').innerText()).trim();const original=questions.find(q=>q.prompt===prompt||q.prompt.startsWith(prompt))!;
  const wrongOption=original.options.find((_,index)=>index!==original.correctIndex)!;
  await page.getByRole('radio',{name:wrongOption,exact:true}).check();await page.getByRole('button',{name:'Periksa jawaban'}).click();
  await expect(page.getByText(/Jawaban (tepat|belum tepat)/).first()).toBeVisible();
  await expect(page.getByRole('link',{name:'Pelajari materi (tab baru)'})).toHaveAttribute('href',/\/materi\/tuhfah-/);
  if(i===0)expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.getByRole('button',{name:i===4?'Lihat hasil':'Soal berikutnya'}).click();
 }
 await expect(page.getByRole('heading',{name:'Sesi selesai'})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const oldPrompts=await page.locator('.result-item h4').allTextContents();await page.getByRole('button',{name:'Buat kuis baru'}).click();await expect(page.getByText('SOAL 1 DARI 5')).toBeVisible();expect(oldPrompts).not.toContain((await page.locator('.question-heading').innerText()).trim());await page.reload();await page.getByRole('button',{name:'Siapkan kuis'}).click();await page.getByRole('button',{name:'Mulai kuis'}).click();for(let i=0;i<5;i++){await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Periksa jawaban'}).click();await page.getByRole('button',{name:i===4?'Lihat hasil':'Soal berikutnya'}).click();}const retry=page.getByRole('button',{name:'Ulangi yang salah'});if(await retry.count()){await retry.click();}
 await page.reload();await page.getByRole('button',{name:'Siapkan kuis'}).click();await expect(page.getByRole('button',{name:'Mulai kuis'})).toBeEnabled();
 expect(await page.evaluate(()=>new Promise<number>((resolve,reject)=>{const request=indexedDB.open('murajaah');request.onsuccess=()=>{const database=request.result;const count=database.transaction('attempts').objectStore('attempts').count();count.onsuccess=()=>{database.close();resolve(count.result);};count.onerror=()=>reject(count.error);};request.onerror=()=>reject(request.error);}))).toBe(10);
 expect(errors).toEqual([]);
});
