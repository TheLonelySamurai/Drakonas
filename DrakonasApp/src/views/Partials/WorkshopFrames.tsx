import {useRef, useEffect} from 'react'
import { useState } from 'react'
import ChangeHolder from './Holder'
function WorkshopFrames(){
    const [count,setCount] = useState(0)
    const framesHandler=useRef<HTMLDivElement | null>(null);
    return(
        <ChangeHolder name="Frames" h={500} w={250} holder="large-part"/>
    )
}
export default WorkshopFrames;