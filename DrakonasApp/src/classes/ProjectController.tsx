class ProjectController {
    

    public static async retrieveProjectInfo():Promise<string>{
        try {
        const sessionId = localStorage.getItem('my_session_id');
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
        return "";
      }
    }
    public static async retrieveProjects():Promise<string>{
        try{
            const res= await fetch("http://localhost:38451/api/load-projects",{
                method:'GET',      
            });
            const text=await res.text();
            console.log(text);
            return text;
        }catch(err){
            console.error("Backend not reachable: "+err);
            return "";
        }
    }
    
    public static async loadProject(projectId: string): Promise<string> {
        try {
            const res = await fetch(`http://localhost:38451/api/load-project/${projectId}`, {
                method: 'GET',
            });
        const text = await res.text();
        console.log(text);
        return text;
      } catch (err) {
        console.error("Backend not reachable:", err);
        return "";
      }
    }
}
export default ProjectController;