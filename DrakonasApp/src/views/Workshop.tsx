import { useState } from 'react'
function Workshop(){
    const [count,setCount] = useState(0)
    return(
        <div className="workshop"><div className="toolbar"><button>Pen</button><button>Eraser</button><button>Air Brush</button><button>Pixel Perfect</button><button>Fill</button><button>Shape</button><button>Rotate</button><button>RGBA Selector</button></div>
        <div className="animation-segments"><div className="preview">Animation Preview</div><div className="frames">Frames</div></div><div className="canvas-holder"><div className="canvas"></div></div><div className="editing-segment"><div className="history">History</div><div className="layers">Layers</div></div></div>
    )
}
export default Workshop;