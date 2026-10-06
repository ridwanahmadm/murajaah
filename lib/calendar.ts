export function formatCalendar(now:Date,timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone){
 const base={timeZone};
 return {clock:new Intl.DateTimeFormat('id-ID',{...base,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(now),gregorian:new Intl.DateTimeFormat('id-ID',{...base,weekday:'long',day:'numeric',month:'long',year:'numeric',calendar:'gregory'}).format(now),hijri:new Intl.DateTimeFormat('id-ID',{...base,day:'numeric',month:'long',year:'numeric',calendar:'islamic-civil'}).format(now)};
}
