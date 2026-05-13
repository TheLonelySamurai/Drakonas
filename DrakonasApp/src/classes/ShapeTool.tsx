import Tool from "./Tool";
import PosXY from "./PosXY";
import StrokeSettings from "./StrokeSettings";
class ShapeTool extends Tool{
    public lineWidth=3;
    public name = "Shape Tool";
    public strokeStyle="black";
    public fillStyle="transparent";
    public opacity=1;
    public temporaryPoints : PosXY[] = [];
    public shapeType="rectangle";
    public isShift=false;
    public svgStr = "";
    constructor(){
        super();
    }
     down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        console.log("LD")
        this.startFinishShape(Tool.lastPos);
        this.isShift=false;
    }

    up():Path2D {
        const temp = this.p;
        this.p = null;
        this.finishShape(Tool.lastPos)
        Tool.isDrawing = false;
        console.log("LU")
        return temp;//To send to the system to undo/redo
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {
        
        super.move(e);
        if(e.shiftKey){
            //Make it snap too a 45 degree angle
            this.isShift=true;
        }
        const ctx = super.getCanvas();
        if (ctx == null) return;
        Tool.lastPos = this.pos;
    }
    startFinishShape(pos : PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        if (this.temporaryPoints.length == 0){
            //start the line!
            this.temporaryPoints.push(pos);
            Tool.isDrawing = true;
            this.actionFinished = 1;
        }
        this.finishShape(pos);     
    }
    finishShape(pos:PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        if (this.temporaryPoints.length == 1){
            //finish the line!
            if (!Tool.isDrawing){
                return;
            }
            if(this.temporaryPoints[0] != pos){
                const ctx=super.getCanvas();
                if (ctx == null) return;
                ctx.lineWidth=this.lineWidth;
                ctx.strokeStyle=Tool.colorPrimary;
                ctx.fillStyle=this.fillStyle;
                ctx.globalAlpha=this.opacity;
                this.temporaryPoints.push(pos);
                const pos1 = this.temporaryPoints[0];
                const pos2 = this.temporaryPoints[1];
                if (this.shapeType == "rectangle"){
                    this.rectangle(ctx, pos1, pos2);
                }
                else if (this.shapeType == "ellipse"){
                    this.oval(ctx,pos1,pos2);
                }
                var strokeSet = new StrokeSettings();
                strokeSet.strokeStyle = Tool.colorPrimary;
                strokeSet.lineWidth = this.lineWidth;
                this.saveAction(strokeSet,this.p, this.svgStr);
                this.svgStr = "";
                this.p = new Path2D();
                this.actionFinished = 2;
                this.temporaryPoints = [];
                Tool.isDrawing= false
            }
            
        }
    }
    rectangle(ctx: CanvasRenderingContext2D,pos1: PosXY,pos2: PosXY){    
        this.p = new Path2D();   
        var w = pos2.x - pos1.x;
        var h = pos2.y - pos1.y;
        if (this.isShift){

            if((pos2.x-pos1.x)>(pos2.y-pos1.y)){
                this.p.rect(pos1.x,pos1.y,h,h); 
                this.svgStr = `M ${pos1.x} ${pos1.y} h ${h} v ${h} h ${-h} z`;
            }
            else{
                this.p.rect(pos1.x,pos1.y, w, w); 
                this.svgStr = `M ${pos1.x} ${pos1.y} h ${w} v ${w} h ${-w} z`;
            }
        }
        else{
            this.p.rect(pos1.x,pos1.y,pos2.x-pos1.x,pos2.y-pos1.y); 
            this.svgStr = `M ${pos1.x} ${pos1.y} h ${w} v ${h} h ${-w} z`;
        }
        ctx.stroke(this.p);

    }
    oval(ctx: CanvasRenderingContext2D,pos1: PosXY,pos2: PosXY){
        this.p = new Path2D();
        if(this.isShift){
        // var radius=Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x)+(pos1.y-pos2.y)*(pos1.y-pos2.y));
        var x=Math.round((pos1.x+pos2.x)/2);
        var y=Math.round((pos1.y+pos2.y)/2);
        var minimumX=Math.min((pos1.x-x),(pos2.x-x));
        var minimumY=Math.min((pos1.y-y),(pos2.y-y));
        var r=Math.abs(Math.min(minimumX,minimumY)); 

        this.svgStr = `M ${x+r} ${y} A ${r} ${r} 0 1 1 ${x-r} ${y} A ${r} ${r} 0 1 1 ${x+r} ${y}`;
        this.p.arc(x,y,r,0,Math.PI*2);
        }
        else{
            var radiusX=Math.abs(pos2.x-pos1.x)/2;
            var radiusY=Math.abs(pos2.y-pos1.y)/2;
            var centerX=pos1.x+radiusX*Math.sign(pos2.x-pos1.x);
            var centerY=pos1.y+radiusY*Math.sign(pos2.y-pos1.y);
            
            this.svgStr = `M ${centerX+radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 1 ${centerX-radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 1 ${centerX+radiusX} ${centerY}`;
            this.p.ellipse(centerX,centerY,radiusX,radiusY,0,0,2*Math.PI);
        }
        ctx.stroke(this.p);
        
    }
    
    exportPropertiesForm(): JSON {
        return JSON.parse(JSON.stringify({
            0: {"name": "Line Width" ,
                "type": {"type": "number", "min": 1, "max": 1000, "step": 1}},
            1: {"name" : "Fill Color",
                "type" : {"type": "color"}},
            2: {"name" : "Stroke Color",
                "type" : {"type": "color"}},
            3: {"name" : "Shape Type",
                "type" : {"type": "select", "options": ["rectangle", "ellipse"]}},
            4: {"name": "Opacity",  
                "type": {"type": "number", "min": 0, "max": 1, "step": 0.01}}
        }));
    }
    exportProperties(): { tool: string; properties: Object[]; } {
        return {
            tool: "shape",
            properties: [
                {name: "Line Width", value: this.lineWidth},
                {name: "Fill Color", value: this.fillStyle},
                {name: "Stroke Color", value: this.strokeStyle},
                {name: "Shape Type", value: this.shapeType},
                {name: "Opacity", value: this.opacity}
            ]
        };
    }
    updateProperty(propertyName: string, value: any): void {
        switch(propertyName){
            case "Line Width":
                this.lineWidth = value;
                break;
            case "Fill Color":
                this.fillStyle = value;
                break;
            case "Stroke Color":
                this.strokeStyle = value;
                break;
            case "Shape Type":
                this.shapeType = value;
                break;
            case "Opacity":
                this.opacity = value;
                break;
            default:
                break;
        }
    }
    getProperty(propertyName: string): any{
        switch(propertyName){
            case "Line Width":
                return this.lineWidth;
                break;
            case "Stroke Color":
                return this.strokeStyle;
                break;
            case "Fill Color":
                return this.fillStyle;
                break;
            case "Shape Type":
                return this.shapeType;
                break;
            case "Opacity":
                return this.opacity;
                break;
            default:
                return null;
        }
    }
}
export default ShapeTool;