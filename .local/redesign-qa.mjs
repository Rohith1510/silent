import { chromium } from '@playwright/test';
const browser = await chromium.launch({channel:'chrome'});
const issues = [];
const screenshots = new Set(['/', '/dashboard', '/builder', '/create', '/privacy', '/notifications']);
for (const width of [1440, 390]) {
 const page = await browser.newPage({ viewport: {width, height:width===390?844:1000} });
 await page.emulateMedia({reducedMotion:'reduce'});
 page.on('pageerror', e => issues.push({width,error:e.message}));
 for (const route of ['/', '/dashboard', '/vault', '/builder', '/create', '/beneficiaries', '/recovery', '/activity', '/privacy', '/settings', '/notifications', '/notifications/verify']) {
  await page.goto('http://127.0.0.1:3100'+route, {waitUntil:'networkidle'});
  const result = await page.evaluate(() => ({
   overflow:document.documentElement.scrollWidth-innerWidth,
   title:document.querySelector('h1')?.textContent,
   background:getComputedStyle(document.body).backgroundColor,
   darkSurfaces:[...document.querySelectorAll('input,select,.panel,.configuration-panel,.protocol-node')].filter(el=>{const c=getComputedStyle(el).backgroundColor.match(/\d+/g);return c&&Number(c[0])<100&&Number(c[1])<100&&Number(c[2])<100}).length
  }));
  if (result.overflow>1 || result.darkSurfaces) issues.push({width,route,...result});
  console.log(JSON.stringify({width,route,...result}));
  if(screenshots.has(route)) await page.screenshot({path:'.local/redesign-'+(route==='/'?'landing':route.slice(1))+'-'+width+'.png',fullPage:true});
 }
 await page.goto('http://127.0.0.1:3100/');
 await page.getByRole('button',{name:/A sign of life/}).click();
 if (!await page.locator('.anatomy-detail').textContent().then(t=>t.includes('never proves death'))) issues.push({width,error:'Anatomy interaction failed'});
 await page.getByRole('button',{name:'Connect wallet',exact:true}).click();
 if (!await page.getByText('Connect securely',{exact:true}).isVisible()) issues.push({width,error:'Wallet menu did not open'});
 if(width===390){
  await page.goto('http://127.0.0.1:3100/dashboard');
  await page.getByRole('button',{name:'Open navigation'}).click();
  if(!await page.getByRole('link',{name:'Liveness & recovery',exact:true}).isVisible()) issues.push({width,error:'Mobile navigation failed'});
 }
 await page.close();
}
await browser.close();
console.log(JSON.stringify({issues},null,2));
if(issues.length) process.exitCode=1;
