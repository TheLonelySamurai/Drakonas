import { useState } from 'react'

import '../css/audioEditor.css';

function AudioEditor(){
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="audio-editor-page">
            <div className="column-holder">
            <div className="audio-editor-canvas"></div>
            <div className="audio-actions"><button className="action-button">Previous</button><button className="action-button">Play</button><button className="action-button">Next</button></div>
            <div className="timeline">Frames</div><div className="timeline">Audio</div> 
            </div> 
        </div>
    )
}
export default AudioEditor;