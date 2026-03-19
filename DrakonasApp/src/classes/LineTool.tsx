import Tool from "./Tool";
import PosXY from "./PosXY";
class Line extends Tool{
    public lineWidth = 1;
    public strokeStyle = "black";
    public temporaryPoints : PosXY[] = [];
    constructor(){
        super();
    }
    down(e: React.MouseEvent<HTMLCanvasElement>) {
        super.down(e);
        this.p = new Path2D();
        console.log("LD")
        this.startFinishLine(Tool.lastPos);
    }

    up():Path2D {
        const temp = this.p;
        this.p = null;
        Tool.isDrawing = false;
        console.log("LU")
        this.startFinishLine(Tool.lastPos)
        return temp;//To send to the system to undo/redo
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {
        
        super.move(e);
        if(e.shiftKey){
            //Make it snap too a 45 degree angle
        }
        const ctx = super.getCanvas();
        console.log("WILL")
        if (ctx == null) return;
        Tool.lastPos = this.pos;
    }
    startFinishLine(pos : PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        else if (this.temporaryPoints.length == 0){
            //start the line!
            this.temporaryPoints.push(pos);
            console.log("Start")
            Tool.isDrawing = true;
        }
        else if (this.temporaryPoints.length == 1){
            //finish the line!
            if (!Tool.isDrawing){
                return;
            }
            if(this.temporaryPoints[0] != pos){


                const ctx = super.getCanvas();
                this.temporaryPoints.push(pos);
                const pos1 = this.temporaryPoints[0];
                const pos2 = this.temporaryPoints[1];

                this.p = new Path2D();
                ctx.lineWidth = 4;
                this.p.moveTo(pos1.x, pos1.y);
                this.p.lineTo(pos2.x, pos2.y);
                
                ctx.stroke(this.p);
                this.p = null;
                console.log("Finish")
                this.temporaryPoints = [];
                Tool.isDrawing= false
            }
            
        }
    }
}
export default Line;