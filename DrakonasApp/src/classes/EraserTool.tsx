import StrokeSettings from "./StrokeSettings";
import Tool from "./Tool";
class Eraser extends Tool{
    public lineWidth=59;
    public svgStr = "";
    public name = "Eraser Tool";
    constructor(){
        super();
    }
    down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        this.actionFinished = 1;
        this.svgStr = "";
    }

    up() {
        var strokeSet = new StrokeSettings();
        strokeSet.strokeStyle = Tool.colorPrimary;
        strokeSet.isEraser = true;
        strokeSet.lineWidth = this.lineWidth;
        strokeSet.lineCap = 'round';
        this.saveAction(strokeSet, this.p, this.svgStr);
        const temp = this.p;
        this.p = new Path2D();
        Tool.isDrawing = false;
        this.actionFinished = 2;
        const ctx=super.getCanvas();
        if (ctx == null) return;
        ctx.globalCompositeOperation='source-over';

    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {

        super.move(e);
        const ctx = super.getCanvas();
        if (ctx == null) return;
        ctx.globalCompositeOperation='destination-out';
        if (Tool.isDrawing){
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = Tool.colorPrimary;
            ctx.lineCap = 'round';
            this.p.moveTo(Tool.lastPos.x, Tool.lastPos.y);
            this.p.lineTo(this.pos.x, this.pos.y);
            ctx.stroke(this.p);
            this.svgStr += `M ${Tool.lastPos.x}  ${Tool.lastPos.y} L ${this.pos.x} ${this.pos.y}`

            Tool.lastPos = this.pos;
            
        }
    }
    exportPropertiesForm(): JSON {
        return JSON.parse(JSON.stringify({
            0: {"name": "Eraser Size" ,
                "type": {"type": "number", "min": 1, "max": 1000, "step": 1}}
        }));
    }
    exportProperties(): {tool: string, properties: Object[]}{
        return {
            tool: "eraser",
            properties: [
                {name: "Eraser Size" ,
                value: this.lineWidth}
            ]
        };
    }
    updateProperty(propertyName: string, value: any): void {
        switch(propertyName){
            case "Eraser Size":
                this.lineWidth = value;
                break;
            default:
                break;
        }
    }
    getProperty(propertyName: string): any{
        switch(propertyName){
            case "Eraser Size":
                return this.lineWidth;
                break;
            default:
                break;
        }
    }
}
export default Eraser;