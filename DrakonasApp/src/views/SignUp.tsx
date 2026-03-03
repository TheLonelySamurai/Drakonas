import { useState } from 'react'
function SignUp(){
    async function signup(username: string, password: string) {
        const response = await fetch("http://localhost:38451/api/signup", {
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
    <div className="login-window">
        <div className="heading">Sign Up</div>
        <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get("email") as string;
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            const validate_password = formData.get("validate_password") as string;
            if (password !== validate_password) {
                alert("Passwords do not match");
                return;
            }
            try {
                const result = await signup(username, password);
                console.log("Signup successful:", result);
            } catch (error) {
                console.error("Signup failed:", error);
            }
        }} className="column-holder">
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
    </div>
    )
}
export default SignUp;