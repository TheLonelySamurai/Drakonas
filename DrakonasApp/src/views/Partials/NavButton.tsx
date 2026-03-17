import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
function Navigation( {name, destId, id}:{name:string, destId:string, id?:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    const goToPage = () => {
        clearPages();
        const el = document.getElementById(destId) as HTMLElement;
        if (el) {
          el.style.display = 'flex';
        }
    
    }
    return <>
     <button className="profile-toolbar-button" id={id} onClick={goToPage}>{name}</button>
      </>
}
export default Navigation;