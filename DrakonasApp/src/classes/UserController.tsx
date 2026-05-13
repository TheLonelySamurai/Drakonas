class UserController{
    
    public static async retrieveUser():Promise<string>{
        try {
        const sessionId = localStorage.getItem('my_session_id');
        const res = await fetch("http://localhost:38451/api/retrieve-user",{
            method: 'GET',
            credentials: 'include' ,// This tells Electron to send the JSESSIONID cookie
            headers: {
                'X-Session-ID': sessionId || '' // Send the ID manually
            }
            });
        const text = await res.text();
        console.log(text);
        return text;
      } catch (err) {
        console.error("Backend not reachable:", err);
        return JSON.stringify({});
      }
    }
}
export default UserController;