import { useState, useEffect } from 'react'
import NavButton from './Partials/NavButton';
import StoryboardForm from './Partials/FormforStoryboard';
import Backend from '../callBackend';
function ProjectType(){
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="project-type-page">
            <Backend/>
            <div className="body-screen">
                <div className="column-holder column-holder-buttons">
                    <NavButton name="Create from Empty" url="/workshop"/>
                    <StoryboardForm name="Create from Storyboard"/>
                    {/* <NavButton name="Character/Item Animator" url="/workshop"/> */}
                </div>  
            </div>
        </div>
         
    )
}
export default ProjectType;