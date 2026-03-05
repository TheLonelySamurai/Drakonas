import { useState } from 'react'
import NavButton from './Partials/NavButton'
import "../css/settingsPage.css";
function Settings(){
    function changeApplicationSettings(){
        console.log("Form to change the application settings")
    }
    const [count,setCount] = useState(0)
    return(
        <div className="page settings" id="settings-page">
            <NavButton name="Back to Main Page" destId="project-page"/>
            <div className="settings-column-holder"><h1 >Application Settings</h1>
                <form onSubmit={async (e)=>{
                    e.preventDefault;
                    changeApplicationSettings();
                }} className='noImpact'>

                <table className="settings-table">
                    <thead>
                        <tr><th>Setting</th><th>-</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Menu Text Size</td><td>...</td></tr>
                        <tr><td>Theme</td><td>...</td></tr>
                        <tr><td>Volume</td><td>...</td></tr>
                    </tbody>
                </table>
                <button>Save Settings</button>
                </form>
            </div>
        </div>
            
              
        
    )
}
export default Settings;