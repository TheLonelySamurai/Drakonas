import { useState } from 'react'
function Workshop(){
    const [count,setCount] = useState(0)
    return(
        <div className="workshop" style={{display: 'none'}}><div className="toolbar"><button>Pen</button><button>Eraser</button><button>Air Brush</button><button>Pixel Perfect</button><button>Fill</button><button>Shape</button><button>Rotate</button><button>RGBA Selector</button></div>
        <div className="animation-segments"><div className="preview"><div className="section-object">Animation Preview</div></div><div className="large-part"><div className="section-object">Frames</div></div></div><div className="canvas-holder"><div className="canvas"></div></div><div className="editing-segment"><div className="history"><div className="section-object">History</div></div><div className="large-part"><div className="section-object">Layers</div></div></div></div>
    )
}
export default Workshop;