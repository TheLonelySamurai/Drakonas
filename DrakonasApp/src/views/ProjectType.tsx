import { useState } from 'react'
import GoToWorkshop from './Partials/GoToWorkshopButton';
function ProjectType(){
    const [count,setCount] = useState(0)
    return(
        <>
        <div className="body-screen page">
          <div className="column-holder column-holder-buttons">
            <GoToWorkshop name="Short Form"/>
            <GoToWorkshop name="Long Form"/>
            <GoToWorkshop name="Character/Item Animator"/>
        </div>  
        </div>
        </>
        
    )
}
export default ProjectType;