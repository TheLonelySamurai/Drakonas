import { useState, useEffect } from 'react'
import { Menu, webContents } from 'electron';

import GoToProfilePage from './Partials/GoToProfilePageButton'
import GoToProjectType from './Partials/GoToProjectTypeButton'
import GoToSettings from './Partials/GoToSettingsButton'
import GoToWorkshop from './Partials/GoToWorkshopButton'
import NavButton from './Partials/NavButton';

declare global {
    interface Window {
        
        menuNav: {
            onReturnHome: (callback: () => void) => void;
        };
      
    }
}

function ProjectPage(){
    const [count,setCount] = useState(0)
    useEffect(()=>{
        window.menuNav.onReturnHome(() => {
            console.log("Home?");
            goHome()});
    }, []); 
    const clearPages = () => {
        for (const element of document.getElementsByClassName('page')){
            const pageElement = element as HTMLElement;
            pageElement.style.display = 'none';
        }
    }
    const goHome = () => {
        clearPages();
        const el = document.getElementById('project-page') as HTMLElement;
        if (el) {
          el.style.display = 'flex';
        }
    
    }
    const login = () =>{
    }
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
            <NavButton name="Profile Page" destId="profile-page"/>
            <NavButton name="Settings" destId="settings-page"/>
            <NavButton name="Create New Project" destId="project-type-page"/>
            <button onClick={login}>CLICK ME</button>
        </div>
        </div>
        
    )
}
export default ProjectPage;