import { useState } from 'react'
function Login(){
    const [count,setCount] = useState(0)
    return(
    <div className="login-window"><div className="heading">Log-in</div><form onSubmit={()=>{}} className="column-holder"><label htmlFor="username" className="input-holder">Username</label><input type="text" className="word-input" name="username"/><label htmlFor="password" className="input-holder">Password</label><input type="password" className="word-input" name="password"/><button className="credentials-button">Sign Up</button><button type="submit" className="credentials-button">Submit</button></form></div>
    )
}
export default Login;