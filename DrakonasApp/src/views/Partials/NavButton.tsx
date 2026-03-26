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
        const sessionId = localStorage.getItem('my_session_id');
        const res = await fetch("http://localhost:38451/api/retrieve-user",{
            method: 'GET',
            credentials: 'include' ,// This tells Electron to send the JSESSIONID cookie
            headers: {
                'X-Session-ID': sessionId || '' // Send the ID manually
            }
            });
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
        if (conditional != null){ 
            var user = await retrieveUser();
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