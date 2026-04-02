import { useState, useEffect } from 'react'
import HomepageLink from './HomepageLink';
function MainTemplate({Page, id}:{ Page: React.ComponentType,  id:string }){
    const [count,setCount] = useState(0)
    useEffect(()=>{
        const page=document.getElementById(id) as HTMLElement
        page.style.display="flex"
    }, []);
    return(
        <>
        <HomepageLink/>
        <Page/>
        </>
        
    )
}
export default MainTemplate;