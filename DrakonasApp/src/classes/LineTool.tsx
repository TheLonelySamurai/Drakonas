import Tool from "./Tool";
import StrokeSettings from "./StrokeSettings";
import PosXY from "./PosXY";
class Line extends Tool{
    public lineWidth = 1;
    public lineCap : CanvasLineCap = "butt";
    public opacity = 1;
    public name = "Line Tool";
    public temporaryPoints : PosXY[] = [];
    
    constructor(){
        super();
    }
    down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        this.startFinishLine(Tool.lastPos);
    }

    up(){
        const temp = this.p;
        this.p = null;
        this.finishLine(Tool.lastPos)
        Tool.isDrawing = false;
        return temp;//To send to the system to undo/redo
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {
        
        super.move(e);
        if(e.shiftKey){
            //Make it snap too a 45 degree angle
        }
        const ctx = super.getCanvas();
        if (ctx == null) return;
        Tool.lastPos = this.pos;
    }
    startFinishLine(pos : PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        if (this.temporaryPoints.length == 0){
            //start the line!
            this.temporaryPoints.push(pos);
            Tool.isDrawing = true;
            this.actionFinished = 1;
        }
        this.finishLine(pos);
    }
    finishLine(pos : PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        else if (this.temporaryPoints.length == 1){
            //finish the line!
            if (!Tool.isDrawing) return;
            if(this.temporaryPoints[0] != pos){


                const ctx = super.getCanvas();
                this.temporaryPoints.push(pos);
                const pos1 = this.temporaryPoints[0];
                const pos2 = this.temporaryPoints[1];

                this.p = new Path2D();
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = Tool.colorPrimary;
                ctx.globalAlpha = this.opacity;
                this.p.moveTo(pos1.x, pos1.y);
                this.p.lineTo(pos2.x, pos2.y);
                
                ctx.stroke(this.p);

                var strokeSet = new StrokeSettings();
                strokeSet.strokeStyle = Tool.colorPrimary;
                strokeSet.lineCap = this.lineCap;
                strokeSet.lineWidth = this.lineWidth;
                const svg = `M ${pos1.x}  ${pos1.y} L ${pos2.x} ${pos2.y}`;
                this.saveAction(strokeSet, this.p, svg);
                this.p = null;
                this.temporaryPoints = [];
                Tool.isDrawing= false
                this.actionFinished = 2;
            }
            
        }
    }
    exportPropertiesForm(): JSON {
        return JSON.parse(JSON.stringify({
            0: {"name": "Line Width" ,
                "type": {"type": "number", "min": 1, "max": 1000, "step": 1}},
            1: {"name" : "Line Cap",
                "type" : {"type": "select", "options": ["butt", "round", "square"]}},
            2: {"name": "Opacity",
                "type": {"type": "number", "min": 0, "max": 1, "step": 0.01}}
        }));
    }
    exportProperties(): { tool: string; properties: Object[]; } {
        return {
            tool: "line",
            properties: [
                {name: "Line Width" ,
                value: this.lineWidth},
                {name: "Line Cap",
                value: this.lineCap},
                {name: "Opacity",   
                value: this.opacity}
            ] 
        };
    }
    updateProperty(propertyName: string, value: any): void {
        switch(propertyName){
            case "Line Width":
                this.lineWidth = value;
                break;
            case "Line Cap":
                this.lineCap = value;
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
            case "Line Cap":
                return this.lineCap;
                break;
            case "Opacity":
                return this.opacity;
                break;
            default:
                return null;
        }
    }
}
export default Line;