import { useState,useEffect,useRef } from 'react'
import {useNavigate} from 'react-router-dom';
import NavButton from './Partials/NavButton';
import ProjectController from '../classes/ProjectController';
import '../css/projectsPage.css';

function ProjectPage(){
    const container=useRef<HTMLDivElement>(null);
    const navigate = useNavigate(); // Hook is called at the top level
    
    const goTo = (url:string) => {
        navigate(url); 
    };
    const [count,setCount] = useState(0)
    async function getJSONProjectData():Promise<JSON | null>{
        var projects= await ProjectController.retrieveProjects();
        if(projects != null){
            return JSON.parse(projects);
        }
        return null;
    }
    useEffect(()=> {
        var projects=getJSONProjectData();
        
        projects.then(function(projectData){
            console.log(projectData);
            if (projectData == null || !projectData.projects || projectData.projects.length === 0 || projectData == JSON.parse("{}")){ 
                if(!container.current)return;
                console.error("Failed to load projects.");
                container.current!.innerHTML="<p>No projects found. Create a new project to get started!</p>";
                
            }
            else{
                    
                var projects=projectData.projects;
                if(projects){
                    if(!container.current)return;
                    container.current.innerHTML="";
                    projects.forEach((project)=>{
                        const card=document.createElement("div")
                        card.className="project-card";
                        const project_title=document.createElement("h2");
                        project_title.innerHTML=""+project.project_name+"";
                        const modified_date=document.createElement("p");
                        modified_date.innerHTML="Last modified on: "+project.last_modified+"";
                        card.appendChild(project_title);
                        card.appendChild(modified_date);
                        container.current.appendChild(card);
                        card.addEventListener('click',()=>{
                            localStorage.setItem('load_project_from_id',project.project_id);
                            goTo("/workshop");
                        })
                            
                    })
                }
            }
        });
    })
    return(
        <div className="page" id="project-page">
            <div className="profile-toolbar">
                <NavButton name="Profile Page" url="/login" conditional="/profile"/>
                <NavButton name="Settings" url="/settings"/>
                <NavButton name="Create New Project" url="/projecttype"/>
            </div>
            <div className="projects-list">
                <h1>Projects</h1> 
                <div className="projects-container" ref={container}>
                    <div className="project-card temp" >
                        <h2 className='project-card-temp-text'>Project 1</h2>
                        <p className='project-card-temp-text'>Last Modified: 2024-06-01</p>
                    </div>
                    <div className="project-card temp">
                        <h2 className='project-card-temp-text'>Project 2</h2>
                        <p className='project-card-temp-text'>Last Modified: 2024-06-02</p>
                    </div>
                </div>
            </div> 
        </div>
        
    )
}
export default ProjectPage;