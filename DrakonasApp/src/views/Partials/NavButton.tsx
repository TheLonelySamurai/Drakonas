import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
function Navigation( {name, destId, id, conditional}:{name:string, destId:string, id?:string, conditional?:string}){
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    async function retrieveUser():Promise<string>{
        try {
        const res = await fetch("http://localhost:38451/api/retrieve-user");
        const text = await res.text();
        console.log(text);
        return text;
      } catch (err) {
        console.error("Backend not reachable:", err);
      }
    }
    async function goToPage() {
        clearPages();
        var el = document.getElementById(destId) as HTMLElement;
        console.log("GO TO")
        if (conditional != null){ 
            console.log("CONDITIONAL")
            var user = await retrieveUser();
            console.log(user)
            if (user == "null"){
                console.log("null?")
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