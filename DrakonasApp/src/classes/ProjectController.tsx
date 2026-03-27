import UserController from "./UserController";
import ProjectData from "./ProjectData";
class ProjectController{
    public static async saveNewProject(projectData:ProjectData){
        /**
        * This function will save the following projects data
        * - Each individual frame and its:
        *   - Each individual layer and its:
        *       - Map<StrokeSettings, Path2D> Each individual drawing action
        *   - Frame position
        *   - Undo-Redo history
        * - Tool Default Settings and Each individual Tools:
        *   - Individual Settings, such as lineWidth
        * - Animation export settings such as
        *   - Frames per second
        * 
        * This function will save all of this data into a custom filetype .drkns
        * Then it will have the user send that data either to the cloud's database or to their system.
        **/
    }
    public static async saveExistingProject(){
        /**
        * This function will save the following projects data
        * - Each individual frame and its:
        *   - Each individual layer and its:
        *       - Map<StrokeSettings, Path2D> Each individual drawing action
        *   - Frame position
        *   - Undo-Redo history
        * - Tool Default Settings and Each individual Tools:
        *   - Individual Settings, such as lineWidth
        * - Animation export settings such as
        *   - Frames per second
        * 
        * This function will save all of this data into a custom filetype .drkns
        * Then it will have the user send that data either to the cloud's database or to their system.
        **/
    }
    public static async exportProjectToCloud(projectData:any){
        const user = JSON.parse(await UserController.retrieveUser());
        /**
        * This function will take all of the data from the filetype .drkns
        * That contains the project data and export it to the database on the cloud
        **/
    }
    public static async exportProjectToSystem(projectData:any){
        /**
        * This function will take all of the data from the filetype .drkns
        * That contains the project data and export it to a specified place on their system
        **/
    }
    public static async loadProject(projectData:any){
        /**
         * This function will recieve a .drkns file and open the projects workshop with the progress
         * and settings saved in that file retrieved   
         * **/
    }
}
export default ProjectController;