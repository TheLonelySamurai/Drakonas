import StrokeSettings from "./StrokeSettings";
import Tool from "./Tool";
class Eraser extends Tool{
    public lineWidth=59;
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
        const ctx=super.getCanvas();
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

            Tool.lastPos = this.pos;
            
        }
    }
}
export default Eraser;