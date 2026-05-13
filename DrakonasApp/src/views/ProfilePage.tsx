import { useEffect, useState } from 'react'
import NavButton from './Partials/NavButton'
import UserController from '../classes/UserController';
import '../css/profilePage.css';
import { useNavigate } from 'react-router-dom';
function ProfilePage(){
    
    const navigate = useNavigate(); // Hook is called at the top level
    
    const goTo = (url:string) => {
        navigate(url); 
    };
    const [count,setCount] = useState(0)
    async function getJSONUserData():Promise<JSON>{
        var userData = await UserController.retrieveUser();
        if (userData != null){
            return JSON.parse(userData);
        }
        return null;

    }
    useEffect(() => {
        var data = getJSONUserData();
        data.then(function(user){
            if (user && user != "null" && user != undefined){
                document.getElementById('pf-page-username').innerHTML = user.username;
                document.getElementById('pf-page-email').innerHTML = user.email;
            }
            else{
                goTo("/login");
                return;
            }
        })
    },[]);
    return(
        <div className="page profile-page" id="profile-page">
            <NavButton name="Back to Main Page" url="/project"/>
            <div className="profile-container">
                <div className="profile-pic">Profile Picture</div>
                <div className="profile-row-holder">
                    <div className="view-half-info-1"><span className="info-title">Username:</span>
                    <span className="info-title">Email:</span>
                    </div>
                    <div className="view-half-info-2"><span className="info" id='pf-page-username'>Username</span>
                    <span className="info" id="pf-page-email">Email</span>
                    </div>
                </div>
                    <button className="view-half-button">Reset Password</button>
                    <button className="view-half-button">Reset Email</button>
            </div>     
        </div>
    )
}
export default ProfilePage;