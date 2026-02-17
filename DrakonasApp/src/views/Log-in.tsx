import { useState } from 'react'
function Login(){
    const [count,setCount] = useState(0)
    console.log("SOS")
    return(
    <div className="login-window"><div className="request">Please log into Drakonas.</div><form onSubmit="handleSubmit" className="form-holder"><label htmlFor="username" className="input-holder">Username</label><input type="text" className="word-input" name="username"/><label htmlFor="password" className="input-holder">Password</label><input type="password" className="word-input" name="password"/><button type="submit" className="submit-button">Submit</button></form></div>
    )
}
export default Login;