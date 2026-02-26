
import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';

import '../css/drawingCanvas.css';
function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasOnionRef = useRef<HTMLCanvasElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const framesHandler = useRef<HTMLDivElement | null>(null);
    const historyHandler = useRef<HTMLDivElement | null>(null);
    const onionSkinEnabled = useRef(false);
    const currentScale = useRef(1);
    const isDrawing = useRef(false);
    const isMovingCanvas = useRef(false);
    const movingCanvas = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const paths = useRef<Path2D[]>([]);
    const undonePaths = useRef<Path2D[]>([]);
    var p = useRef<Path2D | null>(null);

    const frames = useRef<Path2D[][]>([]); // Array of frames, each frame is an array of paths
    const currentFrameIndex = useRef(0);
    
    useEffect(() => {
        // Runs AFTER render
        const framesHolder = document.querySelector('.frames-holder') as HTMLElement;
        if (framesHolder) {
            framesHolder.appendChild(framesHandler.current);
        }
        const historyHolder = document.querySelector('.history-holder') as HTMLElement;
        if (historyHolder) {
            historyHolder.appendChild(historyHandler.current);
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        clearCanvas();
        clearOnionSkin();
        
        window.historyAPI.onUndo(() => undo());
        window.historyAPI.onRedo(() => redo());
    }, []);

    function saveFrame() {
        // Save the current paths into the current frame
        frames.current[currentFrameIndex.current] = [...paths.current];

    }
    
    function newFrame() {
        // Save the current paths as a new frame
        frames.current.push([...paths.current]);
        currentFrameIndex.current = frames.current.length ; // Move to the new frame
        clearCanvas();
        if (onionSkinEnabled.current){
            clearOnionSkin();
            loadOnionSkin(currentFrameIndex.current - 1);
        }

        paths.current = []; // Clear current paths for the new frame
        p.current = null; // Reset current path
    }

    function loadFrame(index: number) {
        if (index < 0 || index >= frames.current.length) return;
        paths.current = [...frames.current[index]];
        currentFrameIndex.current = index;
        redrawCanvas();
        if(onionSkinEnabled.current){
            clearOnionSkin();
            loadOnionSkin(index - 1);
        }
    }

    function loadOnionSkin(index: number) {
        onionSkinEnabled.current = true;
        if (index < 0 || index >= frames.current.length) return;
        const canvas = canvasOnionRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.globalAlpha = 0.5; // Set transparency for onion skin effect
        frames.current[index].forEach(path => {
            ctx.stroke(path);
        });
        ctx.globalAlpha = 1.0; // Reset transparency
    }

    function clearOnionSkin() {
        const canvas = canvasOnionRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onionSkinEnabled.current = false;
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function redrawCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        clearCanvas();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        paths.current.forEach(path => {
            ctx.stroke(path);
        });
    }

    // function exportToGif(){
    //     console.log("Exporting to GIF with frames: ", frames.current.length);
    //     console.log("Frames data: ", frames.current);
    //     const exportCanvas = document.createElement("canvas");
    //     exportCanvas.width = 800;
    //     exportCanvas.height = 600;
    //     const exportCtx = exportCanvas.getContext("2d");


    //     const gif = new GIF({
    //         workers: 2,
    //         quality: 10,
    //         width: 800,
    //         height: 600,
    //         workerScript: '/gif.worker.js'
    //     });

    //     for (let i = 0; i < frames.current.length; i++) {  
    //         exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    //         exportCtx.fillStyle = 'white';
    //         exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    //         frames.current[i].forEach(path => {
    //             exportCtx.stroke(path);
    //         });
    //         gif.addFrame(exportCanvas, { delay: 500, copy: true });
    //     }
    //     gif.on('finished', function(blob) {
    //         const url = URL.createObjectURL(blob);
    //         // window.open(url);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'animation.gif';
    //         a.click();
    //         document.body.removeChild(a);
    //     });
    //     gif.render();
    // }
    function getMousePos(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        
        return {
            x: (e.clientX - rect.left) / currentScale.current,
            y: (e.clientY - rect.top) / currentScale.current,
        };
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (isMovingCanvas.current) return; // Don't start drawing if we're moving the canvas
        // Reset the undone paths when starting a new path
        undonePaths.current = [];
        isDrawing.current = true;
        lastPos.current = getMousePos(e);
        p.current = new Path2D();
        
    }

    function handleMouseUp() {
        if(isMovingCanvas.current) return; // Don't stop drawing if we're moving the canvas
        isDrawing.current = false;
        //Need to save the current path now!
        if (p.current){
            paths.current.push(p.current);
            
        }
        p.current = null;
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isMovingCanvas.current) return; // Don't draw if we're moving the canvas
        if (!isDrawing.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getMousePos(e);
        if (!p.current) {
            p.current = new Path2D();
            p.current.moveTo(pos.x, pos.y);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        p.current.moveTo(lastPos.current.x, lastPos.current.y);
        p.current.lineTo(pos.x, pos.y);
        ctx.stroke(p.current);

        lastPos.current = pos;
    }
    
    function getMousePosMoveCanvas(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function handleMouseDownMoveCanvas(e: React.MouseEvent<HTMLDivElement>) {
        // Reset the undone paths when starting a new path
        if (isMovingCanvas.current) {
            movingCanvas.current = true;
            lastPos.current = getMousePosMoveCanvas(e);
        }
        
    }

    function handleMouseUpMoveCanvas() {
        if (movingCanvas.current) {
            movingCanvas.current = false;
        }
    }

    function handleMouseMoveMoveCanvas(e: React.MouseEvent<HTMLDivElement>) {
        if (movingCanvas.current) {
            const pos = getMousePosMoveCanvas(e);
            const dx = pos.x - lastPos.current.x;
            const dy = pos.y - lastPos.current.y;
            moveCanvas(dx, dy);
            lastPos.current = pos;
        }
    }
    function handleMouseScrollMoveCanvas(e: React.WheelEvent<HTMLDivElement>) {
        if (isMovingCanvas.current) {
            const delta = e.deltaY;
            scaleCanvas(delta > 0 ? 0.95 : 1.05);
        }
        else{            
            const deltay = e.deltaY;
            if (e.shiftKey) {
                moveCanvas(deltay/10, 0);
            }else  {
                moveCanvas(0, -deltay/10);
            }
        }
    }
    function undo(){
        const lastPath = paths.current.pop();
        if (lastPath) {
            undonePaths.current.push(lastPath);
            redrawCanvas();
        }
    }
    function redo(){
            const lastUndonePath = undonePaths.current.pop();
            if (lastUndonePath) {
                paths.current.push(lastUndonePath);
                redrawCanvas();
            }
    }
    
    function moveCanvas(dx: number, dy: number) {
        const canvasContainer = document.querySelector('.canvasContainer') as HTMLElement;
        const currentTransform = canvasContainer.style.transform || 'translate(0px, 0px)';
        const match = currentTransform.match(/translate\((-?\d+)px, (-?\d+)px\)/);
        let currentX = 0;
        let currentY = 0;
        if (match) {
            currentX = parseInt(match[1]);
            currentY = parseInt(match[2]);
        }
        canvasContainer.style.transform = `translate(${currentX + dx}px, ${currentY + dy}px)`;
    }
    function scaleCanvas(scaleFactor: number) {
        const canvasContainer = document.querySelector('.canvasContainer') as HTMLElement;
        const canvases = canvasContainer.querySelectorAll('canvas');
        currentScale.current *= scaleFactor;
        canvases.forEach(canvas => {
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const offsetX = (centerX - window.innerWidth / 2) * (scaleFactor - 1);
            const offsetY = (centerY - window.innerHeight / 2) * (scaleFactor - 1);
            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale.current})`;
        });
    }
    function moveCanvasButton(){
        if (isMovingCanvas.current) {
            isMovingCanvas.current = false;
            document.querySelector('#moveCanvasButton').textContent = "Move Canvas";
        } else {
            isMovingCanvas.current = true;
            document.querySelector('#moveCanvasButton').textContent = "Stop Moving Canvas";
        }
    }
    return (
    <div className="drawingCanvasContainer">
        <div className="drawingApp"
                    onMouseDown={handleMouseDownMoveCanvas}
                    onMouseUp={handleMouseUpMoveCanvas}
                    onMouseLeave={handleMouseUpMoveCanvas}
                    onMouseMove={handleMouseMoveMoveCanvas}
                    onWheel={handleMouseScrollMoveCanvas}>
            <div className="canvasContainer" >
                <canvas className='canvas'
                    ref={canvasOnionRef}
                    width={800}
                    height={600}
                />
                <canvas className='canvas'
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                />
            </div>
        </div>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            clearCanvas();
            
        }}>
            Clear Canvas
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            moveCanvasButton();
            
        }}
            id='moveCanvasButton'>
            Move Canvas
            
        </button>
        <div className="history" ref={historyHandler}>
            <h3>History of Paths</h3>
            <button onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                redrawCanvas();
            }}>
                Redraw Paths
            </button>
            <button onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                undo();
            }}>
                Undo Paths
            </button>
            <button onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                redo();
            }}>
                Redo Paths
            </button>
            <ul>
                {paths.current.map((path, index) => (
                    <li key={index}>Path {index + 1}</li>
                ))}
            </ul>
        </div>
        <div className="history" ref ={framesHandler}>
        <h3>Animation Handler</h3>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            saveFrame();
        }}>
            Save Frame
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            newFrame();
        }}>
            New Frame
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            if (currentFrameIndex.current <= 0) return; // No previous frame
            loadFrame(currentFrameIndex.current - 1);
        }}>
            Prev Frame
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            if (currentFrameIndex.current >= frames.current.length - 1) return; // No next frame
            loadFrame(currentFrameIndex.current + 1);
        }}>
            Next Frame
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            if (currentFrameIndex.current <= 0) return; // No previous frames
            loadOnionSkin(currentFrameIndex.current - 1);
        }}>
            Onion On
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            clearOnionSkin();
        }}>
            Onion Off
        </button>
        
        <button onClick={() => {
            // exportToGif();
        }}>
            Export To Gif
        </button>
        </div>
    </div>
    );
}
export default DrawingCanvas;