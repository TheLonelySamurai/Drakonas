import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import NavButton from "./Partials/NavButton"
function Login(){
    const navigate = useNavigate(); // Hook is called at the top level
    
    const goTo = (url:string) => {
        navigate(url); 
    };
    async function login(username: string, password: string) {
        const response = await fetch("http://localhost:38451/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
            username,
            password
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }
        
        return await response.text();
    }
    const [count,setCount] = useState(0)
    return(
    <div className="page login-window" id="login-page">
        <div className="heading">Log-in</div>
        <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const username = formData.get("username") as string;
            const password = formData.get("password") as string ;
            try {
                var result = await login(username, password);
                console.log("Login successful!");
                var res = JSON.parse(result);
                localStorage.setItem('my_session_id', res.sessionId);
                const postLoginAction = localStorage.getItem("post_login_action");
                if (postLoginAction) {
                    const { url, action } = JSON.parse(postLoginAction);
                    goTo(url);
                    return;
                }
                goTo("/project");
            } catch (error) {
                console.error("Login failed:", error);
                const errorMessageElement = document.querySelector(".error-message");
                if (errorMessageElement) {
                    errorMessageElement.textContent = error ||error.message;
                }
            }
        }} className="column-holder">
            <label htmlFor="username" className="input-holder">Username</label>
            <input type="text" className="word-input" required  name="username"/>
            <label htmlFor="password" className="input-holder">Password</label>
            <input type="password" className="word-input" required  name="password"/>
            <NavButton name="Don't have an account?" url="/signup" id="signup-nav-button"/>
            <button type="submit" className="credentials-button">Submit</button>
            <p className="error-message"></p>
        </form>
    </div>
    )
}
export default Login;