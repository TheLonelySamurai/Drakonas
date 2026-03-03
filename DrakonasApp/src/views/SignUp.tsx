import { useState } from 'react'
function SignUp(){
    const [count,setCount] = useState(0)
    return(
        <div id='signup-page' className="signup page">
      <div className="login-window"><div className="heading">Sign Up</div><form  className="column-holder"><label htmlFor="email" className="input-holder">Email Address</label><input type="email" name="email" className="word-input"/><label htmlFor="username" className="input-holder">Create your Username</label><input type="text" className="word-input" name="username"/><label htmlFor="password" className="input-holder">Create your Password</label><input type="password" className="word-input" name="password"/><label className="input-holder" htmlFor="validate_password">Validate Password</label><input type="password" className="word-input" name="validate_password"/><button type="submit" className="credentials-button">Submit</button></form></div>  
    </div>  
    
 
    )
}
export default SignUp;