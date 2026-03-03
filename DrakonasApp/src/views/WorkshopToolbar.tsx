import { useState } from 'react'
import '../css/workshop.css'
import '../css/tools.css'
function WorkshopToolbar(){
    const [count,setCount] = useState(0)
    return(
<div className="toolbar"><button className="tool_icon pen"></button>
<button className="tool_icon"><span className="tool_icon eraser"></span></button>
<button><span className="tool_icon air_brush"></span></button>
<button><span className="tool_icon pixel_perfect"></span></button>
<button><span className="../other/fill_tool.png"></span></button><button><span className="tool_icon shape"></span></button><button><span className="tool_icon rotate"></span></button><button>RGBA Selector</button></div>        
    )
}
export default WorkshopToolbar;