import { useState } from 'react'
import '../css/workshop.css';
import NavButton from './Partials/NavButton';
import DrawingCanvas from './drawingCanvas';

// import GIF from 'gif.js';
import Backend from '../callBackend';

function Workshop(){
    const [count,setCount] = useState(0)
    return(
        <div className="page workshop" id="workshop-page">
            <Backend/>
            <div className="toolbar">
                
            </div>
            <div className="animation-segments">
                <div className="preview border-right">
                    <div className="section-object">Project Settings</div>
                    <div className="project-settings-holder"></div>
                </div>
                <div className="large-part border-top border-right">
                    <div className="section-object">Frames</div>
                    <div className="frames-holder"></div>
                </div>
            </div>
            <div className="canvas-holder">
                <DrawingCanvas/>
                <div className="animation-holder"></div>
            </div>
            <div className="editing-segment">
                <div className="history-container border-left">
                    <div className="section-object">History</div>
                    <div className="history-holder"></div>
                </div>
                <div className="large-part border-top border-left">
                    <div className="section-object">Layers</div>
                    
                    <div className="layers-holder"></div>
                </div>
            </div>
        </div>
    )
}
export default Workshop;