import PosXY from "./PosXY";
abstract class Tool {
    public static scale: number;
    public static isDrawing: boolean;
    public static lastPos: PosXY;
    public static canvas: HTMLCanvasElement;
    public pos: PosXY;
    public p: Path2D;
    constructor() {
    }
    
    static getMousePos(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        
        return new PosXY(
            (e.clientX - rect.left) / Tool.scale,
            (e.clientY - rect.top) / Tool.scale,
        );
        
    }

    down(e: React.MouseEvent<HTMLCanvasElement>) {
        // Reset the undone paths when starting a new path
        Tool.isDrawing = true;
        Tool.lastPos = Tool.getMousePos(e);
    }

    up():Path2D {
        //Need to save the current path now!
        this.p = null;
        Tool.isDrawing = false;
        return null;
    }

    move(e: React.MouseEvent<HTMLCanvasElement>) {
        this.pos = Tool.getMousePos(e);
    }
    getCanvas(){
        const canvas = Tool.canvas;
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        return ctx;

    }
}
export default Tool;