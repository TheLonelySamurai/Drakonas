

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        
        menuNav: {
            onReturnHome: (callback: () => void) => void;
        };
      
    }
}
function App() {
    const navigate = useNavigate(); // Hook is called at the top level
    useEffect(()=>{
        window.menuNav.onReturnHome(() => {
            console.log("Home?");
            goHome()});
    }, []); 
        
    const goHome = () => {
        navigate('/project');
    }
    return <></>;
}
export default App;