import { useState } from 'react'
function AudioEditor(){
    const [count,setCount] = useState(0)
    return(
        <body className="column-holder">
         <div className="audio-editor-canvas"></div>
        <div className="audio-actions"><button className="action-button">Previous</button><button className="action-button">Play</button><button className="action-button">Next</button></div>
        <div className="timeline">Frames</div><div className="timeline">Audio</div> 
        </body> 
    )
}
export default AudioEditor;