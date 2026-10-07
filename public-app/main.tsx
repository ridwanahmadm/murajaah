import {useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {usePathname} from './navigation';
import Notes from '../app/catatan/page';
import Home from '../app/page';
import Materials from '../app/materi/page';
import Lesson from '../app/materi/[lessonId]/page';
import Collection from '../app/materi/koleksi/[subjectId]/page';
import Quiz from '../app/kuis/page';
import Add from '../app/tambah/page';
import Settings from '../app/pengaturan/page';
import NotFound from '../app/not-found';
import {LibraryProvider} from '../components/library-provider';
import {Nav} from '../components/nav';
import {DeviceStorage} from './storage';
import '../app/globals.css';
import './public.css';
function App(){const path=usePathname();const previousPath=useRef(path);useEffect(()=>{if(previousPath.current===path)return;previousPath.current=path;window.scrollTo(0,0);const heading=document.querySelector<HTMLHeadingElement>('main h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}},[path]);const page=path==='/'?<Home/>:path==='/materi'?<Materials/>:path.startsWith('/materi/koleksi/')?<Collection key={path}/>:path.startsWith('/materi/')?<Lesson key={path}/>:path==='/catatan'?<Notes/>:path==='/kuis'?<Quiz/>:path==='/tambah'?<Add/>:path==='/pengaturan'?<Settings/>:<NotFound/>;return <><a href="#main" className="skip" onClick={event=>{event.preventDefault();document.getElementById('main')?.focus();}}>Lewati navigasi</a><LibraryProvider><Nav/><main id="main" tabIndex={-1}>{page}{(path==='/'||path==='/pengaturan')&&<DeviceStorage/>}</main></LibraryProvider></>;}
createRoot(document.getElementById('root')!).render(<App/>);
