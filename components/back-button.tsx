import {Icon} from './icon';
export function BackButton({onClick,children,disabled=false}:{onClick:()=>void;children:React.ReactNode;disabled?:boolean}){
 return <div className="flow-back"><button type="button" className="plain-button text-link" disabled={disabled} onClick={onClick}><Icon name="back"/>{children}</button></div>;
}
