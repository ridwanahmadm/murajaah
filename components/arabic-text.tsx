// Isolate every Arabic run, including diacritics, without changing stored source text.
export function ArabicText({text}:{text:string}){
 const parts=text.split(/([\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]+(?:[ \u200c\u200d]+[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]+)*)/);
 return <>{parts.map((part,index)=>/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/.test(part)?<span key={index} className="arabic-inline" lang="ar" dir="rtl">{part}</span>:part)}</>;
}
