import { useEffect, useState } from 'react'
import NavButton from './Partials/NavButton'
import '../css/profilePage.css';
import { session } from 'electron';
function ProfilePage(){
    const [count,setCount] = useState(0)
    
    useEffect(()=>{
        var user = sessionStorage.getItem("user");
        console.log("USER: " + user);
    }, []); 
    return(
        <div className="page profile-page" id="profile-page">
            <NavButton name="Back to Main Page" destId="project-page"/>
            <div className="profile-container">
                <div className="profile-pic">Profile Picture</div>
                <div className="profile-row-holder">
                    <div className="view-half-info-1"><span className="info-title">Username:</span>
                    <span className="info-title">Email:</span>
                    </div>
                    <div className="view-half-info-2"><span className="info">Username</span>
                    <span className="info">Email</span>
                    </div>
                </div>
                    <button className="view-half-button">Reset Password</button>
                    <button className="view-half-button">Reset Email</button>
            </div>     
        </div>
    )
}
export default ProfilePage;