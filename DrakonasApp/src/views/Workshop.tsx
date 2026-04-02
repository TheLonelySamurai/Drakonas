import { useState } from 'react'
import '../css/workshop.css';

import DrawingCanvas from './drawingCanvas';

// import GIF from 'gif.js';


function Workshop(){
    const [count,setCount] = useState(0)
    return(
        <div className="page workshop" id="workshop-page">
            <div className="toolbar">
                <button>Pen</button>
                <button>Eraser</button>
                <button>Air Brush</button>
                <button>Pixel Perfect</button>
                <button>Fill</button>
                <button>Shape</button>
                <button>Rotate</button> 
                <button>RGBA Selector</button>
            </div>
            <div className="animation-segments">
                <div className="preview">
                    <div className="section-object">Animation Preview</div>
                </div>
                <div className="large-part">
                    <div className="section-object">Frames</div>
                    <div className="frames-holder"></div>
                </div>
            </div>
            <div className="canvas-holder">
                <DrawingCanvas/>
                <div className="animation-holder"></div>
            </div>
            <div className="editing-segment">
                <div className="history-container">
                    <div className="section-object">History</div>
                    <div className="history-holder"></div>
                </div>
                <div className="large-part">
                    <div className="section-object">Layers</div>
                    <div className="layers-holder"></div>
                </div>
            </div>
        </div>
    )
}
export default Workshop;