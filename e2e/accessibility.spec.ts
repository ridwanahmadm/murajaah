import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/','/materi','/materi/nun','/kuis','/tambah','/pengaturan','/tidak-ada'];
test('all screens meet automated accessibility checks',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of routes){await page.goto(path);await expect(page.locator('h1')).toBeVisible();await expect(page.getByRole('status',{name:'Status cadangan'}).or(page.getByRole('button',{name:'Mulai kuis'})).or(page.locator('h1')).first()).toBeVisible();expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations,`axe ${path}`).toEqual([]);}
 await page.goto('/materi/nun');const arabic=page.locator('.arabic-inline').first();await expect(arabic).toHaveAttribute('lang','ar');await expect(arabic).toHaveAttribute('dir','rtl');await expect(arabic).toHaveCSS('font-size','32px');
 expect(errors).toEqual([]);
});
test('reflow at required widths and 200 percent zoom',async({page},testInfo)=>{
 for(const width of [320,360,390,768,1280]){await page.setViewportSize({width,height:900});for(const path of routes.slice(0,6)){await page.goto(path);await expect(page.locator('h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}`).toBe(true);if(path==='/'&&testInfo.project.name==='desktop')await page.screenshot({path:`verification/home-${width}.png`,fullPage:true});}}
 await page.setViewportSize({width:1280,height:900});await page.goto('/pengaturan');await page.evaluate(()=>{document.body.style.zoom='2';});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('keyboard skip link, visible focus and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Lewati navigasi'})).toBeFocused();await page.keyboard.press('Enter');await page.keyboard.press('Tab');const focused=page.locator(':focus');await expect(focused).toHaveCSS('outline-style','solid');await expect(focused).toHaveCSS('outline-width','3px');
 await page.goto('/kuis');await page.getByRole('button',{name:'Mulai kuis'}).click();await expect(page.locator('.question-heading')).toBeFocused();await page.keyboard.press('Tab');await page.keyboard.press('Space');await expect(page.getByRole('radio').first()).toBeChecked();await expect(page.getByRole('button',{name:'Periksa jawaban'})).toBeEnabled();
});
