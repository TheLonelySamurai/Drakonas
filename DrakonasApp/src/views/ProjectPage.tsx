import { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import NavButton from './Partials/NavButton';

import '../css/projectsPage.css';
function ProjectPage(){
    const navigate = useNavigate(); // Hook is called at the top level
    
    const goTo = (url:string) => {
        navigate(url); 
    };
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
                <NavButton name="Profile Page" url="/login" conditional="/profile"/>
                <NavButton name="Settings" url="/settings"/>
                <NavButton name="Create New Project" url="/projecttype"/>
            </div>
            <div className="projects-list">
                <h1>Projects</h1>
                <div className="projects-container">
                    <div className="project-card" onClick={()=>{
                        localStorage.setItem('load_project_from_id', '1');
                        goTo("/workshop");
                    }}>
                        <h2>Project 1</h2>
                        <p>Created on: 2024-06-01</p>
                    </div>
                    <div className="project-card">
                        <h2>Project 2</h2>
                        <p>Created on: 2024-06-02</p>
                    </div>
                </div>
            </div> 
        </div>
        
    )
}
export default ProjectPage;