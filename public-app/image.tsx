import type {ImgHTMLAttributes} from 'react';
export default function Image({fill,unoptimized: _unoptimized,...props}:ImgHTMLAttributes<HTMLImageElement> & {fill?:boolean;unoptimized?:boolean}){void _unoptimized;return <img {...props} alt={props.alt??''} style={{...props.style,...(fill?{position:'absolute',height:'100%',width:'100%',inset:0}: {})}}/>;}
