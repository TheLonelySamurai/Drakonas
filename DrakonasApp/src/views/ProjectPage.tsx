import { useState } from 'react'
import NavButton from './Partials/NavButton';


function ProjectPage(){
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
            <NavButton name="Profile Page" url="/login" conditional="/profile"/>
            <NavButton name="Settings" url="/settings"/>
            <NavButton name="Create New Project" url="/projecttype"/>
        </div>
        </div>
        
    )
}
export default ProjectPage;