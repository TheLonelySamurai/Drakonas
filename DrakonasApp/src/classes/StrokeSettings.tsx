import Tool from "./Tool";
class StrokeSettings{
    public order : number;
    public lineWidth : number;
    public strokeStyle : string | CanvasGradient;
    public lineCap : CanvasLineCap;
    public fillStyle : string | CanvasGradient;
    public globalAlpha : number;
    public isEraser : boolean;
    public angle:number=0;
    constructor(){
        this.order = Tool.order;
        Tool.order ++;
        this.lineWidth = 1;
        this.strokeStyle = Tool.colorPrimary;
        this.lineCap = "butt";
        this.fillStyle = Tool.colorPrimary;
        this.globalAlpha = 1;
        this.isEraser = false;
    }
}
export default StrokeSettings;