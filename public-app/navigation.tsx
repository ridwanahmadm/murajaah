import {useSyncExternalStore, type AnchorHTMLAttributes} from 'react';
function subscribe(notify:()=>void){window.addEventListener('hashchange',notify);return()=>window.removeEventListener('hashchange',notify);}
function snapshot(){return window.location.hash.startsWith('#/')?window.location.hash.slice(1):'/';}
export function usePathname(){return useSyncExternalStore(subscribe,snapshot,()=>'/').split('?')[0];}
export function useParams<T extends Record<string,string>>(){const path=usePathname();const parts=path.split('/');return (parts[2]==='koleksi'?{subjectId:decodeURIComponent(parts[3]??'')}:{lessonId:decodeURIComponent(parts[2]??'')}) as unknown as T;}
export function useRouter(){return {push:(href:string)=>{window.location.hash=href;},replace:(href:string)=>{window.history.replaceState(null,'',`#${href}`);window.dispatchEvent(new HashChangeEvent('hashchange'));},back:()=>window.history.back(),refresh:()=>window.location.reload()};}
export default function Link({href,children,...props}:AnchorHTMLAttributes<HTMLAnchorElement> & {href:string}){return <a {...props} href={href.startsWith('/')?`#${href}`:href}>{children}</a>;}
