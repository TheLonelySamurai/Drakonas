import { useState } from 'react'
import NavButton from './Partials/NavButton';
import ProjectController from '../classes/ProjectController';

function ProjectPage(){
    const [count,setCount] = useState(0)
    async function getJSONUserData():Promise<JSON>{
        var projects= await ProjectController.retrieveProjects();
        if(projects != null){
            return JSON.parse(projects);
        }
        return null;
    }
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