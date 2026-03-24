import Tool from "./Tool";
import PosXY from "./PosXY";
class ShapeTool extends Tool{
    public lineWidth=3;
    public strokeStyle="black";
    public temporaryPoints : PosXY[] = [];
    public shapeType="rectangle";
    public isShift=false;
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
        console.log("WILL")
        if (ctx == null) return;
        Tool.lastPos = this.pos;
    }
    startFinishShape(pos : PosXY){
        if (this.temporaryPoints.length >= 2){
            this.temporaryPoints = [];
        }
        else if (this.temporaryPoints.length == 0){
            //start the line!
            this.temporaryPoints.push(pos);
            console.log("Start")
            Tool.isDrawing = true;
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
                ctx.lineWidth=this.lineWidth;
                ctx.strokeStyle=this.strokeStyle; 
                this.temporaryPoints.push(pos);
                const pos1 = this.temporaryPoints[0];
                const pos2 = this.temporaryPoints[1];
                this.oval(ctx,pos1,pos2);
                this.p = null;
                console.log("Finish")
                this.temporaryPoints = [];
                Tool.isDrawing= false
            }
            
        }
    }
    rectangle(ctx: CanvasRenderingContext2D,pos1: PosXY,pos2: PosXY){       
        if (this.isShift){

            if((pos2.x-pos1.x)>(pos2.y-pos1.y)){
                ctx.strokeRect(pos1.x,pos1.y,pos2.y-pos1.y,pos2.y-pos1.y); 
            }
            else{
                ctx.strokeRect(pos1.x,pos1.y,pos2.x-pos1.x,pos2.x-pos1.x); 
            }
        }
        else{
           ctx.strokeRect(pos1.x,pos1.y,pos2.x-pos1.x,pos2.y-pos1.y); 
        }
       

    }
    oval(ctx: CanvasRenderingContext2D,pos1: PosXY,pos2: PosXY){
        var radius=Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x)+(pos1.y-pos2.y)*(pos1.y-pos2.y));
        var x=Math.round((pos1.x+pos2.x)/2);
        var y=Math.round((pos1.y+pos2.y)/2);
        radius=radius/2;
        ctx.beginPath();
        ctx.arc(x,y,radius,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    }
}
export default ShapeTool;