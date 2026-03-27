import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
import UserController from '../../classes/UserController';
function Navigation( {name, destId, id, conditional}:{name:string, destId:string, id?:string, conditional?:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    async function goToPage() {
        clearPages();
        var el = document.getElementById(destId) as HTMLElement;
        if (conditional != null){ 
            var user = await UserController.retrieveUser();
            if (user == "null"){
                el = document.getElementById(conditional) as HTMLElement;
            }
            
            if (el) {
                el.style.display = 'flex';
            }
        }
        else{
            if (el) {
                el.style.display = 'flex';
            }
        }
    }
    return <>
     <button className="profile-toolbar-button" id={id} onClick={goToPage}>{name}</button>
      </>
}
export default Navigation;