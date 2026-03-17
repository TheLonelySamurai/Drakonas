import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
function Navigation( {name}:{name:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    const goToSignUp = () => {
        clearPages();
        const workshopElement = document.getElementById('signup-page') as HTMLElement;
        if (workshopElement) {
          workshopElement.style.display = 'flex';
        }
        else{
            console.log("Does not exist");
        }
    
    }
    return <> 
     <button className="credentials-button" onClick={goToSignUp}>{name}</button>
      </>
}
export default Navigation;