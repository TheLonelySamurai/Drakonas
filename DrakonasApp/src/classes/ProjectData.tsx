import StrokeSettings from "./StrokeSettings";

class ProjectData{
    //Current view information
    public onionSkinEnabled : boolean;
    public currentFrameIndex : number;
    //Frames 
    public frames : Map<StrokeSettings, Path2D>[][];
    public framesUndonePaths : Map<StrokeSettings, Path2D>[][];
    //Tools preferences
}
export default ProjectData;