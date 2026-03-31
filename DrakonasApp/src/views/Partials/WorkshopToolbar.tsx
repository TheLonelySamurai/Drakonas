import { useState } from 'react'
function WorkshopToolbar(){
    const [count,setCount] = useState(0)
    return(
<div className="toolbar"><button>Pen</button><button>Eraser</button><button>Air Brush</button><button>Pixel Perfect</button><button>Fill</button><button>Shape</button><button>Rotate</button><button>RGBA Selector</button></div>        
    )
}
export default WorkshopToolbar;