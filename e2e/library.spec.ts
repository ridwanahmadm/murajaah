import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('read, mark unread, and navigate between lessons',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'Baca materi',exact:true}).click();await expect(page.locator('h1')).toHaveText('Mengenal Tuhfatul Athfal');await expect(page.getByText('Ini pelajaran pertama.')).toBeVisible();
 await page.getByRole('button',{name:'Tandai sudah dibaca'}).click();await expect(page.getByRole('button',{name:'Tandai belum dibaca'})).toBeEnabled();await page.reload();await expect(page.getByRole('button',{name:'Tandai belum dibaca'})).toBeEnabled();await page.getByRole('button',{name:'Tandai belum dibaca'}).click();await expect(page.getByRole('button',{name:'Tandai sudah dibaca'})).toBeEnabled();await page.reload();await expect(page.getByRole('button',{name:'Tandai sudah dibaca'})).toBeEnabled();
 await page.getByRole('link',{name:/Materi selanjutnya/}).click();await expect(page.locator('h1')).toHaveText('Nun Sakinah dan Tanwin');await page.getByRole('link',{name:/Materi sebelumnya/}).click();await expect(page.locator('h1')).toHaveText('Mengenal Tuhfatul Athfal');
 await expect(page).toHaveTitle(/Murajaah/);await expect(async()=>{expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);}).toPass({timeout:5000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
