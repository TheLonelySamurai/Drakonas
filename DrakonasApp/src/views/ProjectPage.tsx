import { useState, useEffect } from 'react'

import GoToProfilePage from './Partials/GoToProfilePageButton'
import GoToProjectType from './Partials/GoToProjectTypeButton'
import GoToSettings from './Partials/GoToSettingsButton'
import GoToWorkshop from './Partials/GoToWorkshopButton'
import NavButton from './Partials/NavButton';
function ProjectPage(){
    const [count,setCount] = useState(0) 
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
            <NavButton name="Profile Page" destId="profile-page"/>
            <NavButton name="Settings" destId="settings-page"/>
            <NavButton name="Create New Project" destId="project-type-page"/>
        </div>
        </div>
        
    )
}
export default ProjectPage;