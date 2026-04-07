import StrokeSettings from "./StrokeSettings";
import Tool from "./Tool";

class Pen extends Tool{
    public lineWidth = 59;
    public opacity = 1;
    public name = "Pen";
    constructor(){
        super();
    }
    down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        this.actionFinished = 1;
    }

    up() {
        var strokeSet = new StrokeSettings();
        strokeSet.strokeStyle = Tool.colorPrimary;
        strokeSet.lineWidth = this.lineWidth;
        strokeSet.lineCap = 'round';
        this.saveAction(strokeSet, this.p);
        const temp = this.p;
        this.p = new Path2D();
        Tool.isDrawing = false;
        this.actionFinished = 2;

    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {

        super.move(e);
        const ctx = super.getCanvas();
        if (ctx == null) return;
        if (Tool.isDrawing){
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = Tool.colorPrimary;
            ctx.globalAlpha = this.opacity;
            ctx.lineCap = 'round';
            this.p.moveTo(Tool.lastPos.x, Tool.lastPos.y);
            this.p.lineTo(this.pos.x, this.pos.y);
            ctx.stroke(this.p);

            Tool.lastPos = this.pos;
            
        }
    }
    exportProperties(): JSON{
        return JSON.parse(JSON.stringify({
            0: {"name": "Line Width", 
                "type" : {"type": "number" , "min": 1, "max": 1000, "step": 1}},
            1: {"name": "Opacity", 
                "type" : {"type": "number", "min": 0, "max": 1, "step": 0.01}}
        }));
    }
    updateProperty(propertyName: string, value: any): void {
        switch(propertyName){
            case "Line Width":
                this.lineWidth = value;
                break;
            case "Opacity":
                this.opacity = value;
                break;
        }
    }
    getProperty(propertyName: string): any{
        switch(propertyName){
            case "Line Width":
                return this.lineWidth;
            case "Opacity":
                return this.opacity;
            default:
                return null;
        }
    }
}
export default Pen;