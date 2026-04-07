import StrokeSettings from "./StrokeSettings";
import PosXY from "./PosXY";
import Tool from "./Tool";
class Rotate extends Tool{
    constructor(){
        super()
      
      
      let angle=0;  
    }
    up():Path2D {
        const temp = this.p;
        this.p = null;
        this.rotate(pos:PosXY)
        Tool.isDrawing = false;
        return temp;//To send to the system to undo/redo
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {
        
        super.move(e);
        const ctx = super.getCanvas();
        if (ctx == null) return;
        Tool.lastPos = this.pos;
    }
    rotate(pos:PosXY){
      const ctx=super.getCanvas();
      const centerX=canvas.style.width/2;
      const centerY=canvas.style.height/2;
      const angle=Math.atan2(pos.y-centerY,pos.x=centerX);
      ctx.rotate(angle);
      
    }
}
export default Rotate;