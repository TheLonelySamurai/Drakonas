import { useState,useEffect,useRef, use } from 'react'
import {useNavigate} from 'react-router-dom';
import NavButton from './Partials/NavButton';
import ProjectController from '../classes/ProjectController';
import '../css/projectsPage.css';

function ProjectPage(){
    const container=useRef<HTMLDivElement>(null);
    const currentProjectCard=useRef<HTMLDivElement>(null);
    const navigate = useNavigate(); // Hook is called at the top level
    
    const goTo = (url:string) => {
        navigate(url); 
    };
    const [count,setCount] = useState(0)
    async function getJSONProjectData():Promise<JSON | null>{
        var projects= await ProjectController.retrieveProjects();
        if(projects != null || projects != undefined || projects != "" || projects != JSON.stringify({}) || projects != JSON.stringify(undefined)){
            return JSON.parse(projects);
        }
        return JSON.parse("{}");
    }
    useEffect(()=> {
        var projects=getJSONProjectData();
        
        projects.then(function(projectData: any){
            console.log(projectData);
            if (projectData == null || !projectData.projects || projectData.projects.length === 0 || projectData == JSON.parse("{}")){ 
                if(!container.current)return;
                console.error("Failed to load projects.");
                container.current!.innerHTML="<p>No projects found. Create a new project to get started!</p>";
                
            }
            else if (projectData.user === false){
                if(!container.current)return;
                console.error("Failed to load projects.");
                container.current!.innerHTML="<p>User not logged in. Please log in to view your projects.</p>";
                const btn = document.createElement('button');
                btn.textContent = 'Go to Login';
                btn.addEventListener('click', () => goTo('/login'));
                container.current.appendChild(btn);

            }
            else{
                    
                var projects=projectData.projects as Array<{project_id: string, project_name: string, last_modified: string}>;
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
                        if(!container.current)return;
                        container.current.appendChild(card);
                        card.addEventListener('click',()=>{
                            localStorage.setItem('load_project_from_id',project.project_id);
                            goTo("/workshop");
                        })
                            
                    })
                }
            }
        });
    }, []);
    useEffect(()=>{
        ProjectController.retrieveProjectInfo().then(function(info){
            console.log(info);
            var hasProject = false;
            var hasLocal =  false;
            var card = document.createElement("div");
            var projectInfo = info ? JSON.parse(info) : null;
            if(projectInfo && projectInfo.projectName){
                hasProject = true;
                card.className = "project-card";
                card.innerHTML = "<h2>"+projectInfo.projectName+"</h2><p>Last modified: "+projectInfo.projectLastModified+"</p>";
            } else {
                var title = localStorage.getItem('project_title');
                var frames = localStorage.getItem('frames');
                if (title && frames && currentProjectCard.current){
                    hasProject = true;
                    hasLocal = true;
                    card.className = "project-card";
                    card.innerHTML = "<h2>"+JSON.parse(title)+"</h2><p>Last modified: (not saved)</p>";
                    
                }
            }
            if (!hasProject) return;
            
            // The project settings should show that there is a proejct from the database, but use locally saved data for that project if it is available.
            // if there is a project from the database but no local data, load the project from the database when clicked. If there is local data, load that instead and ignore the database version since it is likely outdated if the user has local changes.

            if(currentProjectCard.current) currentProjectCard.current.appendChild(card);
            if (hasLocal){
                card.addEventListener('click',()=>{
                    goTo("/workshop");
                });
                return;
            }
            else{
                card.addEventListener('click',()=>{
                    localStorage.setItem('load_project_from_id',projectInfo.projectId);
                    goTo("/workshop");
                });
            }
        });
    }, []);
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
            <div className="current-project-card" ref={currentProjectCard}>

            </div>
        </div>
        
    )
}
export default ProjectPage;