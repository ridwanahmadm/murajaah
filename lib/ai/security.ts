import {createHash,timingSafeEqual} from 'node:crypto';
export function validAccessCode(supplied:string|null,expected:string|undefined){
 if(!supplied||!expected||expected.length<24||supplied.length>512)return false;
 return timingSafeEqual(createHash('sha256').update(supplied).digest(),createHash('sha256').update(expected).digest());
}
// One bucket per running instance, not per spoofable IP. Code is required before consuming it.
export class GenerationLimiter{
 private times:number[]=[];private busy=false;
 acquire(now=Date.now()):{allowed:boolean;retryAfter:number}{
  this.times=this.times.filter(t=>t>now-3600000);
  const minute=this.times.filter(t=>t>now-60000);
  if(this.busy)return {allowed:false,retryAfter:30};
  if(minute.length>=3)return {allowed:false,retryAfter:Math.max(1,Math.ceil((minute[0]+60000-now)/1000))};
  if(this.times.length>=12)return {allowed:false,retryAfter:Math.max(1,Math.ceil((this.times[0]+3600000-now)/1000))};
  this.times.push(now);this.busy=true;return {allowed:true,retryAfter:0};
 }
 release(){this.busy=false;}
}
