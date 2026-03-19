import Tool from "./Tool";

class Pen extends Tool{
    public lineWidth = 1;
    public strokeStyle = "black";
    constructor(){
        super();
    }
    down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        console.log("DOWN")
    }

    up():Path2D {
        const temp = this.p;
        this.p = null;
        Tool.isDrawing = false;
        console.log("UP")
        return temp;//To send to the system to undo/redo
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {

        super.move(e);
        const ctx = super.getCanvas();
        console.log("WILL")
        if (ctx == null) return;
        if (Tool.isDrawing){
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineCap = 'round';
            this.p.moveTo(Tool.lastPos.x, Tool.lastPos.y);
            this.p.lineTo(this.pos.x, this.pos.y);
            ctx.stroke(this.p);

            Tool.lastPos = this.pos;
            
            console.log("MOVE")
        }
    }
}
export default Pen;