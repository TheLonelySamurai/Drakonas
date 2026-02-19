import { useState } from 'react'
function ProjectType(){
    const [count,setCount] = useState(0)
    return(
        <body className="body-screen">
          <div className="column-holder column-holder-buttons">
            <button className="project-button">Short Form</button>
            <button className="project-button">Long Form</button>
            <button className="project-button">Character/Item Animator</button>
        </div>  
        </body>
        
    )
}
export default ProjectType;