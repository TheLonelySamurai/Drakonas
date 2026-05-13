

import { useState, useEffect } from 'react' 
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        
        menuNav: {
            onReturnHome: (callback: () => void) => void;
            onReturnToWorkshop: (callback: () => void) => void;
        };
      
    }
}
function App() {
    const navigate = useNavigate(); // Hook is called at the top level
    useEffect(()=>{
        window.menuNav.onReturnHome(() => {
            console.log("Home?");
            localStorage.removeItem("post_login_action");
            goHome()});
    }, []); 
        
    const goHome = () => {
        navigate('/project');
    }
    
    useEffect(()=>{
        window.menuNav.onReturnToWorkshop(() => {
            console.log("Workshop?");
            localStorage.removeItem("post_login_action");
            goWorkshop()});
    }, []); 
        
    const goWorkshop = () => {
        navigate('/workshop');
    }
    return <></>; 
}
export default App;