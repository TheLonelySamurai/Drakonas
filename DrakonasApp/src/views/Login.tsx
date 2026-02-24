import { useState } from 'react'
import GoToSignUp from './Partials/GoToSignUpButton'
function Login(){
    const [count,setCount] = useState(0)
    return(
        <div className="page" id="login" style={{display:"flex"}}>
            <div className="login-window"><div className="heading">Log-in</div><form onSubmit={()=>{}} className="column-holder"><label htmlFor="username" className="input-holder">Username</label><input type="text" className="word-input" name="username"/><label htmlFor="password" className="input-holder">Password</label><input type="password" className="word-input" name="password"/><GoToSignUp name="Sign-Up"/>
            <button type="submit" className="credentials-button">Submit</button></form></div>
        </div>
    
    )
}
export default Login;