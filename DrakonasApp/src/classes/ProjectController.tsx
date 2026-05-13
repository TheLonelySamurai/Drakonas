import UserController from "./UserController";

class ProjectController {
    

    public static async retrieveProjectInfo():Promise<string>{
        try {
        const sessionId = localStorage.getItem('project_session_id');
        const res = await fetch("http://localhost:38451/api/retrieve-current-project-info",{
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
    public static async retrieveProjects():Promise<string>{
        var user;
        var userId;
        try{
            user = JSON.parse(await UserController.retrieveUser());
            userId = user.userId;
        } catch (err){
            console.log("User Unavailable: " + err);
            return JSON.stringify("{}");
        }

        try{
            const res= await fetch(`http://localhost:38451/api/load-projects/${userId}`,{
                method:'GET',
                headers: {
                    'X-Session-ID': localStorage.getItem('my_session_id') || ''
                }
            });
            const text=await res.text();
            console.log(text);
            return text;
        }catch(err){
            console.error("Backend not reachable: "+err);
            return JSON.stringify({});
        }
    }
    
    public static async loadProject(projectId: string): Promise<string> {
        var user;
        var userId;
        try{
            user = JSON.parse(await UserController.retrieveUser());
            userId = user.userId;
        } catch (err){
            console.error("User ID not found. Cannot load project.");
            return JSON.stringify({user: false, error: "User not logged in."});
        }

        if (!userId) {
            console.error("User ID not found. Cannot load project.");
            return JSON.stringify({user: false, error: "User not logged in."});
        }
        try {
            const res = await fetch(`http://localhost:38451/api/load-project/${userId}/${projectId}`, {
                method: 'GET',
                headers: {
                    'X-Session-ID': localStorage.getItem('my_session_id') || ''
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
export default ProjectController;