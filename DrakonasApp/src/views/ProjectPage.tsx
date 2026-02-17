import { useState } from 'react'
function ProjectPage(){
    const [count,setCount] = useState(0)
    return(
        <div className="profile-toolbar">
            <button className="profile-toolbar-button">User Profile</button>
            <button className="profile-toolbar-button">Settings</button>
            <button className="profile-toolbar-button">Create New Project</button>
        </div>
    )
}
export default ProjectPage;