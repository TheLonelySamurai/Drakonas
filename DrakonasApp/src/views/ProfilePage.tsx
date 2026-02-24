import { useState } from 'react'
function ProfilePage(){
    const [count,setCount] = useState(0)
    return(
        <div className="profile-page">
    <div className="page" id="profile">
        <div className="profile-pic">Profile Picture</div>
            <div className="profile-row-holder">
                <div className="view-half-info-1"><span className="info-title">Username:</span>
                <span className="info-title">Email:</span>
                </div>
                <div className="view-half-info-2"><span className="info">Username</span>
                <span className="info">Email</span>
                </div>
            </div>
            <div className="profile-row-holder">
                <div className="view-half-button"><button>Reset Password</button></div>
                <div className="view-half-button"><button>Reset Email</button></div>
            </div>
    </div>     
        </div>
    )
}
export default ProfilePage;