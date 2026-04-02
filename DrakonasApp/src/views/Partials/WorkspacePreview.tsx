import { useState } from 'react'
function WorkshopPreview(){
    const [count,setCount] = useState(0)
    return( 
       <div className="preview"><div className="section-object">Animation Preview</div></div>
    )
}
export default WorkshopPreview;