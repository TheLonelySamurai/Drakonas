import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
function Navigation( {name}:{name:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    const goToWorkshop = () => {
        clearPages();
        const workshopElement = document.querySelector('.workshop') as HTMLElement;
        if (workshopElement) {
          workshopElement.style.display = 'flex';
          console.log("Workshop Element Found and Displayed");
        }
    
    }
    return <> 
     <button className="project-button"  onClick={goToWorkshop}>{name}</button>
      </>
}
export default Navigation;
    
