import { useState } from 'react'
function ProjectType(){
    const [count,setCount] = useState(0)
    return(
        <body className="column-holder">
            <button>Short Form</button>
            <button>Long Form</button>
            <button>Character/Item Animator</button>
        </body>
    )
}
export default ProjectType;