import { useState } from 'react'
function Settings(){
    const [count,setCount] = useState(0)
    return(
            <div className="page" id="settings">
                <div className="column-holder"><div className="heading">Settings</div></div>
            <div className="row-holder">
                <div className="settings-left">
                    <div className="setting-card">Menu Text Size</div>
                    <div className="setting-card">Theme</div>
                    <div className="setting-card">Volume Settings</div>
                    </div>
                    <div className="settings-right">
                    <div className="setting-card">...</div>
                    <div className="setting-card">...</div>
                    <div className="setting-card">...</div>
                        </div></div>
            </div>
              
        
    )
}
export default Settings;