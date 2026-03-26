import Tool from "./Tool";
import StrokeSettings from "./StrokeSettings";
import PosXY from "./PosXY";
class Line extends Tool{
    public lineWidth = 1;
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
                this.p.moveTo(pos1.x, pos1.y);
                this.p.lineTo(pos2.x, pos2.y);
                
                ctx.stroke(this.p);

                var strokeSet = new StrokeSettings();
                strokeSet.strokeStyle = Tool.colorPrimary;
                strokeSet.lineCap = "butt";
                strokeSet.lineWidth = this.lineWidth;
                this.saveAction(strokeSet, this.p);
                this.p = null;
                this.temporaryPoints = [];
                Tool.isDrawing= false
                this.actionFinished = 2;
            }
            
        }
    }
}
export default Line;