import { useState } from 'react'
import NavButton from './Partials/NavButton';
function SignUp(){
    async function signup(name: string,email: string,username: string, password: string) {
        const response = await fetch("http://localhost:38451/api/signup", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
            name,
            email,
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
    <div className="page login-window" id="signup-page">
        <div className="heading">Sign Up</div>
        <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name=formData.get("name") as string;
            const email = formData.get("email") as string;
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            const validate_password = formData.get("validate_password") as string;
            if (password !== validate_password) {
                alert("Passwords do not match");
                return;
            }
            try {
                const result = await signup(name,email,username, password);
                console.log("Signup successful:", result);
            } catch (error) {
                console.error("Signup failed:", error);
            }
        }} className="column-holder">
            <label htmlFor="name" className="input-holder">Name</label>
            <input type="text" className="word-input" name="name"/>
            <label htmlFor="email" className="input-holder">Email Address</label>
            <input type="email" name="email" className="word-input"/>
            <label htmlFor="username" className="input-holder">Create your Username</label>
            <input type="text" className="word-input" name="username"/>
            <label htmlFor="password" className="input-holder">Create your Password</label>
            <input type="password" className="word-input" name="password"/>
            <label className="input-holder" htmlFor="validate_password">Validate Password</label>
            <input type="password" className="word-input" name="validate_password"/>
            <button type="submit" className="credentials-button">Submit</button>
        </form>
            <div>Have an account already? <NavButton name="Login" url="/login" id="signup-to-login-button"/></div>
    </div>
    )
}
export default SignUp;