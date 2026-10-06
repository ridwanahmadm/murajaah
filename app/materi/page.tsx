"use client";
import Link from 'next/link';
import {SubjectCard} from '@/components/subject-card';
import {useLibrary,LibraryState} from '@/components/library-provider';
export default function Library(){const {subjects,loading,error}=useLibrary();return <><header className="page-head"><p className="eyebrow">PERPUSTAKAAN</p><h1>Materi</h1><p>Pilih satu koleksi untuk melihat pelajaran dan progres belajarnya.</p><Link href="/tambah" className="text-link">Tambah materi</Link></header><LibraryState/><div className="cards">{subjects.map(s=><SubjectCard key={s.id} subject={s} manage/>)}</div>{!loading&&!error&&!subjects.length&&<p className="notice">Belum ada koleksi. Tambahkan materi atau impor cadangan melalui Pengaturan.</p>}</>;}
