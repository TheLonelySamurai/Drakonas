import { useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import UserController from '../../classes/UserController';
function Navigation( {name, url, id, conditional, onClick}:{name:string, url:string, id?:string, conditional?:string, onClick?: ()=> void }){
    const navigate = useNavigate(); // Hook is called at the top level

    const goTo = (url:string) => {
        navigate(url); 
    };

    async function goToPage() {
        if (onClick)onClick();
        
        if (conditional != null){ 
            var user = await UserController.retrieveUser();
            if (user == "null" || user == null || user == undefined){
                goTo(url);
                return;
            }
            goTo(conditional);
            return; 
        } 
        goTo(url);
    }
    return <>
     <button className="profile-toolbar-button" id={id} onClick={goToPage}>{name}</button>
      </>
}
export default Navigation;