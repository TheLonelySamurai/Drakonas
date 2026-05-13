import PosXY from "./PosXY";
import StrokeSettings from "./StrokeSettings";
abstract class Tool {
    public static scale: number;
    public static isDrawing: boolean;
    public static lastPos: PosXY;
    public static canvas: HTMLCanvasElement;
    public static order : number = 0;
    public name: string;
    public pos: PosXY;
    public p: Path2D;
    public static colorPrimary : string | CanvasGradient;
    public static colorSecondary : string | CanvasGradient;
    public actions : Map<StrokeSettings, Object>;
    public actionFinished : number;
    constructor() {
        this.actions = new Map<StrokeSettings, Object>();
        this.actionFinished = 0;
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

    up(){
        //Need to save the current path now!
        this.p = null;
        Tool.isDrawing = false;
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
    saveAction(strokeSet : StrokeSettings, path: Path2D, svgStr: String){
        const obj = {
            path : path,
            svgStr : svgStr
        }
        this.actions.set(strokeSet, obj);
    }
    exportActionMap():Map<StrokeSettings, Object>{
        var temp = new Map<StrokeSettings, Object>();
        this.actions.forEach(function (value,key){
            temp.set(key,value);
        })
        this.actions.clear();
        return temp;
    }
    exportPropertiesForm(): JSON{
        return JSON.parse(JSON.stringify({}));
    }
    exportProperties():  {tool: string, properties: Object[]}{
        return JSON.parse(JSON.stringify({tool: this.name, properties: []}));
    }
    updateProperty(propertyName: string, value: any){
        // This function will be used to update the properties of the tool when they are changed in the UI
    }
    getProperty(propertyName: string): any{
        // This function will be used to get the current value of a property when it is changed in the UI
    }
}
export default Tool;