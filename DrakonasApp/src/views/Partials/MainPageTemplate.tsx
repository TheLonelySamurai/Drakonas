import { useState, useEffect } from 'react'
function MainTemplate({Page, startPage, id}:{ Page: React.ComponentType, startPage?:boolean, id:string }){
    const [count,setCount] = useState(0)
    useEffect(()=>{
        if (startPage == null){
            startPage = false;
        }
        if(startPage){
            const page=document.getElementById(id) as HTMLElement
            page.style.display="flex"
        }
    });
    return(
        <>
        <Page/>
        </>
        
    )
}
export default MainTemplate;