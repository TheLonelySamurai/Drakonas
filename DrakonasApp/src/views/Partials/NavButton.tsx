import { useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import UserController from '../../classes/UserController';
function Navigation( {name, url, id, conditional}:{name:string, url:string, id?:string, conditional?:string}){
    const navigate = useNavigate(); // Hook is called at the top level

    const goTo = (url:string) => {
        navigate(url); 
    };

    async function goToPage() {
        if (conditional != null){ 
            var user = await UserController.retrieveUser();
            if (user == "null"){
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