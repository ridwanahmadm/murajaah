"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Icon,type IconName} from './icon';
const links:{href:string;label:string;icon:IconName}[]=[{href:'/',label:'Beranda',icon:'home'},{href:'/materi',label:'Materi',icon:'book'},{href:'/catatan',label:'Catatan',icon:'notes'},{href:'/kuis',label:'Kuis',icon:'quiz'},{href:'/tambah',label:'Tambah',icon:'plus'},{href:'/pengaturan',label:'Pengaturan',icon:'settings'}];
export function Nav(){const path=usePathname();return <aside className="sidebar"><Link href="/" className="brand">murajaah<span>Ruang untuk mengingat.</span></Link><nav aria-label="Navigasi utama">{links.map(({href,label,icon})=><Link key={href} href={href} aria-current={(href==='/'?path==='/':path.startsWith(href))?'page':undefined}><Icon name={icon}/>{label}</Link>)}</nav><p className="side-note">Sedikit demi sedikit,<br/>lebih memahami.</p></aside>;}
