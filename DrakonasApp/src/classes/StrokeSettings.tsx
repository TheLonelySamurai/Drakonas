import Tool from "./Tool";
class StrokeSettings{
    public order : number;
    public lineWidth : number;
    public strokeStyle : string | CanvasGradient;
    public lineCap : CanvasLineCap;
    public fillStyle : string;
    public globalAlpha : number;
    constructor(){
        this.order = Tool.order;
        Tool.order ++;
    }
}
export default StrokeSettings;