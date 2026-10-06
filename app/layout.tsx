import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';import {Nav} from '@/components/nav';import {LibraryProvider} from '@/components/library-provider';
const latin=localFont({src:'../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',variable:'--font-latin',display:'swap'});const arabic=localFont({src:'../node_modules/@fontsource-variable/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2',variable:'--font-arabic',display:'swap'});
export const metadata:Metadata={title:'Murajaah — Ruang untuk mengingat',description:'Belajar singkat, memahami kaidah, dan mengulang dengan tenang.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body className={`${latin.variable} ${arabic.variable}`}><a href="#main" className="skip">Lewati navigasi</a><LibraryProvider><Nav/><main id="main">{children}</main></LibraryProvider></body></html>;}
