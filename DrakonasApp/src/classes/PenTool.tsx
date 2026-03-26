import StrokeSettings from "./StrokeSettings";
import Tool from "./Tool";

class Pen extends Tool{
    public lineWidth = 59;
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
        this.p = null;
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
            ctx.lineCap = 'round';
            this.p.moveTo(Tool.lastPos.x, Tool.lastPos.y);
            this.p.lineTo(this.pos.x, this.pos.y);
            ctx.stroke(this.p);

            Tool.lastPos = this.pos;
            
        }
    }
}
export default Pen;