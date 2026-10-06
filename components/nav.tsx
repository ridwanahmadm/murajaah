"use client";
import Link from 'next/link';import {usePathname} from 'next/navigation';
const links=[['/','Beranda','⌂'],['/materi','Materi','▤'],['/kuis','Kuis','◷'],['/tambah','Tambah','＋'],['/pengaturan','Pengaturan','⚙']];
export function Nav(){const path=usePathname();return <aside className="sidebar"><Link href="/" className="brand">murajaah<span>Ruang untuk mengingat.</span></Link><nav aria-label="Navigasi utama">{links.map(([href,label,icon])=><Link key={href} href={href} aria-current={(href==='/'?path==='/':path.startsWith(href))?'page':undefined}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav><p className="side-note">Sedikit demi sedikit,<br/>lebih memahami.</p></aside>;}
