
import { useRef, useEffect } from 'react';

import './drawingCanvas.css';

// import GIF from 'gif.js';

function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasOnionRef = useRef<HTMLCanvasElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const onionSkinEnabled = useRef(false);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const paths = useRef<Path2D[]>([]);
    const undonePaths = useRef<Path2D[]>([]);
    var p = useRef<Path2D | null>(null);

    const frames = useRef<Path2D[][]>([]); // Array of frames, each frame is an array of paths
    const currentFrameIndex = useRef(0);
    
    useEffect(() => {
        // Runs AFTER render
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        clearCanvas();
        clearOnionSkin();
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
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        // Reset the undone paths when starting a new path
        undonePaths.current = [];
        isDrawing.current = true;
        lastPos.current = getMousePos(e);
        p.current = new Path2D();
        }

        function handleMouseUp() {
        isDrawing.current = false;
        //Need to save the current path now!
        if (p.current){
            paths.current.push(p.current);
            
        }
        p.current = null;
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
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
        p.current.moveTo(lastPos.current.x, lastPos.current.y);
        p.current.lineTo(pos.x, pos.y);
        ctx.stroke(p.current);

        lastPos.current = pos;
    }
    return (
        <>
        <div className="drawingApp">
            <div className="canvasContainer">
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
            <div className='previewContainer'>
                <canvas className='preview'
                    ref={previewCanvasRef}
                    width={800}
                    height={600}
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
    <div className="history">
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
            const lastPath = paths.current.pop();
            if (lastPath) {
                undonePaths.current.push(lastPath);
                redrawCanvas();
            }
        }}>
            Undo Paths
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const lastUndonePath = undonePaths.current.pop();
            if (lastUndonePath) {
                paths.current.push(lastUndonePath);
                redrawCanvas();
            }
        }}>
            Redo Paths
        </button>
        <ul>
            {paths.current.map((path, index) => (
                <li key={index}>Path {index + 1}</li>
            ))}
        </ul>
    </div>
    <div className="animation">
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
    </>
    );
}

export default DrawingCanvas;