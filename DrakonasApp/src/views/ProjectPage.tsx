import { useState, useEffect } from 'react'

import GoToProfilePage from './Partials/GoToProfilePageButton'
import GoToProjectType from './Partials/GoToProjectTypeButton'
import GoToSettings from './Partials/GoToSettingsButton'
import GoToWorkshop from './Partials/GoToWorkshopButton'
function ProjectPage(){
    const [count,setCount] = useState(0) 
    useEffect(()=>{const page=document.getElementById("project-page") as HTMLElement
    page.style.display="flex"});
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
            <GoToProfilePage name="Profile Page"/>
            <GoToSettings name="Settings"/>
            <GoToProjectType name="Create New Project"/>
        </div>
        </div>
        
    )
}
export default ProjectPage;