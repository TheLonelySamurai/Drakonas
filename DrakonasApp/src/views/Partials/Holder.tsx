import { useRef, useEffect } from 'react';
function changeHolder({name, h, w, holder}:{name:string, h:number, w:number, holder:string}){
    return(
        <div className="large-part" style={{height: h+"px", width: w+"px"}}><div className="section-object">{name}</div><div className={holder} ></div></div>
    )
}
export default changeHolder;
