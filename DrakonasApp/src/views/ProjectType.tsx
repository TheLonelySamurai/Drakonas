import { useState, useEffect } from 'react'
import NavButton from './Partials/NavButton';
import Backend from '../callBackend';
function ProjectType(){
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="project-type-page">
            <Backend></Backend>
            <div className="body-screen">
                <div className="column-holder column-holder-buttons">
                    <NavButton name="Short Form" url="/workshop"/>
                    <NavButton name="Long Form" url="/workshop"/>
                    <NavButton name="Character/Item Animator" url="/workshop"/>
                </div>  
            </div>
        </div>
         
    )
}
export default ProjectType;