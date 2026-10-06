"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <><h1>Halaman belum dapat dibuka</h1><p>Silakan coba lagi. Data yang sudah tersimpan tetap berada di browser Anda.</p><button className="button" onClick={reset}>Coba lagi</button></>;}
