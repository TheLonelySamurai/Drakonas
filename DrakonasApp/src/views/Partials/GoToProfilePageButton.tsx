import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
function Navigation( {name}:{name:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    const goToProfilePage = () => {
        clearPages();
        const workshopElement = document.getElementById('profile') as HTMLElement;
        if (workshopElement) {
          workshopElement.style.display = 'flex';
        }
    
    }
    return <> 
     <button className="profile-toolbar-button" onClick={goToProfilePage}>{name}</button>
      </>
}
export default Navigation;