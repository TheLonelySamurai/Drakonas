
import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
import { IconBase } from 'react-icons/lib';
import { FaCog } from 'react-icons/fa';
import '../css/drawingCanvas.css';
import Tool from "../classes/Tool";
import Pen from "../classes/PenTool";
import Line from "../classes/LineTool";
import Shape from "../classes/ShapeTool";
import StrokeSettings from '../classes/StrokeSettings';
function DrawingCanvas() {
    //Canvases
    const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasOnionRef = useRef<HTMLCanvasElement | null>(null);
    //Layers
    const layersDivRef = useRef<HTMLDivElement | null>(null);
    const currentLayerDivRef = useRef<HTMLDivElement | null>(null);
    const canvasLayers = useRef<Map<StrokeSettings,Path2D>[][]>([[]]);
    const currentLayerIndex=useRef(0);
    //Section Handlers
    const framesHandler = useRef<HTMLDivElement | null>(null);
    const historyHandler = useRef<HTMLDivElement | null>(null);
    const animationHandler = useRef<HTMLDivElement | null>(null);
    const toolsHandler = useRef<HTMLDivElement | null>(null);
    const toolPropertiesMenu = useRef<HTMLDivElement | null>(null);
    const layerHandler=useRef<HTMLDivElement | null>(null);
    //Color inputs
    const inputPrimary = useRef<HTMLInputElement | null>(null);
    const inputSecondary = useRef<HTMLInputElement | null>(null);
    //Tool initialization
    const toolMode = useRef("pen");
    const tools = new Map<String, Tool>();
    tools.set("pen", new Pen());
    tools.set("line", new Line());
    tools.set("shape",new Shape());
    //Deprecated 
    const temporaryPoints = useRef([]);
    const isDrawing = useRef(false);
    //Canvas Variables
    const onionSkinEnabled = useRef(false);
    const currentScale = useRef(1);
    const isMovingCanvas = useRef(false);
    const movingCanvas = useRef(false);
    const wasByAlt = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    //Undo Redo and Frames
    const paths = useRef<Map<StrokeSettings,Path2D>[]>([]);
    const undonePaths = useRef<Map<StrokeSettings,Path2D>[]>([]);
    const frames = useRef<Map<StrokeSettings, Path2D>[][]>([]); // Array of frames, each frame is an array of paths
    const currentFrameIndex = useRef(0);
    
    useEffect(() => {
        // Runs AFTER render, the initialization of the elements to their functionality
        const canvasHolder = document.querySelector('.canvas-holder') as HTMLElement;
        const drawingApp = document.querySelector('.drawingApp') as HTMLElement;
        const framesHolder = document.querySelector('.frames-holder') as HTMLElement;
        if (framesHolder) {
            framesHolder.appendChild(framesHandler.current);
        }
        const animationHolder = document.querySelector('.animation-holder') as HTMLElement;
        if (animationHolder) {  
            animationHolder.appendChild(animationHandler.current);
        }
        const historyHolder = document.querySelector('.history-holder') as HTMLElement;
        if (historyHolder) {
            historyHolder.appendChild(historyHandler.current);
        }
        const layerHolder = document.querySelector('.layers-holder') as HTMLElement;
        if (layerHolder) {
            layerHolder.appendChild(layerHandler.current);
        }
        const toolsHolder = document.querySelector('.toolbar') as HTMLElement;
        if (toolsHolder){
            toolsHolder.appendChild(toolsHandler.current);
            toolsHolder.appendChild(toolPropertiesMenu.current);
        }
        const canvas = canvasRef.current;
        Tool.canvas = canvas;
        Tool.scale = currentScale.current;
        Tool.colorPrimary = inputPrimary.current.value;
        Tool.colorSecondary = inputSecondary.current.value;
        
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        clearCanvas();
        clearOnionSkin();
        saveFrame();
        drawBackground();
        const removeUndo = window.historyAPI.onUndo(() => undo());
        const removeRedo = window.historyAPI.onRedo(() => redo());
        moveCanvas(canvasHolder.clientWidth/2 - canvas.width/2, drawingApp.clientHeight/2 - canvas.height/2);
        return () => {
            removeUndo();
            removeRedo();
        };
    }, []);
    //Frame Related
        function saveFrame() {
            // Save the current paths into the current frame

            // Update the preview for this frame
            addPreviewFrameToFramesHandler(currentFrameIndex.current);

        }
        
        function newFrame() {
            saveFrame(); // Save the current frame before creating a new one
            currentFrameIndex.current = frames.current.length ; // Move to the new frame
            clearCanvas();
            if (onionSkinEnabled.current){
                clearOnionSkin();
                loadOnionSkin(currentFrameIndex.current - 1);
            }

            paths.current = []; // Clear current paths for the new frame
        }

        function loadFrame(index: number) {
            if (index < 0 || index >= frames.current.length) return;
            currentFrameIndex.current = index;

            redrawCanvas();
            if(onionSkinEnabled.current){
                clearOnionSkin();
                loadOnionSkin(index - 1);
            }
        }
        function removeFrame(frameIndex: number){
            
            if (frameIndex < 0 || frameIndex >= frames.current.length) return;
            frames.current.splice(frameIndex, 1);
            // If the removed frame is before the current frame, adjust the current frame index
            if (currentFrameIndex.current > frameIndex) {
                currentFrameIndex.current--;
            }
            loadFrame(currentFrameIndex.current); // Reload the current frame to update the canvas
            // Update the preview for all frames after the removed frame
            clearPreviewFrames();
            for (let i = frameIndex; i < frames.current.length; i++) {
                addPreviewFrameToFramesHandler(i);
            }
        }

        function clearPreviewFrames() {
            const framesHolder = framesHandler.current;
            if (!framesHolder) return;
            framesHolder.innerHTML = '';  
        }
        function removePreviewFrame(frameIndex: number){
            const framesHolder = framesHandler.current;
            if (!framesHolder) return;
            const previewCanvases = framesHolder.querySelectorAll('.frame');
            if (frameIndex < 0 || frameIndex >= previewCanvases.length) return;
            previewCanvases.forEach((canvas) => {
                if (canvas.id === `frame-${frameIndex}`) {
                    framesHolder.removeChild(canvas);
                }
            });

        }
        function addPreviewFrameToFramesHandler(frameIndex: number) {
            /*
                This function creates a div that holds the frame preview, you can click on it to move to that frame
            
                1. Create the outer div that will hold the preview canvas and otheer elements (this gets classes added for styling)
                2. Create other elements (non important for functionality but for styling and quality of life) such as the frame label and delete button
                3. Create the preview canvas inside of a button element
                4. Add event listener to the preview canvas button to load the frame when clicked (see function above)
                5. Draw the preview frame data into the preview canvas, then resize it to be smaller than the actual canvas (this is done after drawing to avoid blurriness)
                6. Add the preview frame to the frames handler in the correct order based on the frame index

            */ 
           //Step 1
            const framePreviewContainer = document.createElement('div');
            const frameLabel = document.createElement('div');
            frameLabel.textContent = `Frame ${frameIndex + 1}`;
            frameLabel.style.textAlign = 'center';
            frameLabel.style.fontSize = '12px';
            frameLabel.style.marginBottom = '4px';
            framePreviewContainer.appendChild(frameLabel);
            const frameDeleteButton = document.createElement('button');
            frameDeleteButton.textContent = 'X';
            frameDeleteButton.style.position = 'absolute';
            frameDeleteButton.style.top = '0';
            frameDeleteButton.style.right = '0';
            frameDeleteButton.style.background = 'red';
            frameDeleteButton.style.color = 'white';
            frameDeleteButton.style.border = 'none';
            frameDeleteButton.addEventListener('click', () => {
                removeFrame(frameIndex);
            });
            framePreviewContainer.appendChild(frameDeleteButton);
            const frameCanvasButton = document.createElement('button');
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = 800;
            frameCanvas.height = 600;
            const ctx = frameCanvas.getContext('2d');
            if (!ctx) return;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.lineCap = 'round';
            //resize the preview canvas to be smaller
            frameCanvas.style.width = '160px';
            frameCanvas.style.height = '120px';
            frameCanvasButton.appendChild(frameCanvas);
            frameCanvasButton.addEventListener('click', () => {
                loadFrame(frameIndex);
            });
            framePreviewContainer.style.position = 'relative';
            framePreviewContainer.appendChild(frameCanvasButton);
            framePreviewContainer.id = `frame-${frameIndex}`;
            framePreviewContainer.className = 'frame';
            //If the frame already has a preview, remove it before adding the new one
            removePreviewFrame(frameIndex);
            //Make sure the order of the frame previews is correct by inserting the new preview at the correct index
            const framesHolder = framesHandler.current;
            if (!framesHolder) return;
            const previewCanvases = framesHolder.querySelectorAll('.frame');
            if (frameIndex >= previewCanvases.length) {
                framesHolder.appendChild(framePreviewContainer);
            } else {
                framesHolder.insertBefore(framePreviewContainer, previewCanvases[frameIndex]);
            }
        }
    //Onion Related
        function loadOnionSkin(index: number) {
            onionSkinEnabled.current = true;
            if (index < 0 || index >= frames.current.length) return;
            const canvas = canvasOnionRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.globalAlpha = 0.5; // Set transparency for onion skin effect
            
            ctx.globalAlpha = 1.0; // Reset transparency
        }

        
        function clearOnionSkin() {
            const canvas = canvasOnionRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            onionSkinEnabled.current = false;
        }
        function drawBackground() {
            const canvas = backgroundCanvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        console.log("Redrawing canvas with paths: ", paths.current);
        clearCanvas();
        // console.log("PATHS + " +paths.current);
        for(let i = 0; i < paths.current.length; i ++){
            let map = paths.current[i];
            // console.log(map);
            map.forEach(function (value, key){
                // console.log("KEY: " + key + " | VALUE: " + value)
                if (value == null)return;
                // console.log(key);
                // console.log(value)
                ctx.fillStyle = key.fillStyle;
                ctx.strokeStyle = key.strokeStyle;
                ctx.lineWidth = key.lineWidth;
                ctx.lineCap  = key.lineCap;
                ctx.stroke(value);
            });
        }
    }
    //Layers Functions
    function createLayer(){

        console.log("layer");
        const layer=document.createElement('canvas');
        layer.className="canvas";
        layer.width=800;
        layer.height=600;
        layer.id=`Mainlayer-${canvasLayers.current.length}`;
        layersDivRef.current.appendChild(layer);
        addLayerPreview();
        canvasLayers.current.push([]);
    }
    function addLayerPreview(){
        const layerPreviewContainer = document.createElement('div');
            const layerLabel = document.createElement('div');
            layerLabel.textContent = `Layer ${canvasLayers.current.length}`;
            layerLabel.style.textAlign = 'center';
            layerLabel.style.fontSize = '12px';
            layerLabel.style.marginBottom = '4px';
            layerPreviewContainer.appendChild(layerLabel);
            const layerDeleteButton = document.createElement('button');
            layerDeleteButton.textContent = 'X';
            layerDeleteButton.style.position = 'absolute';
            layerDeleteButton.style.top = '0';
            layerDeleteButton.style.right = '0';
            layerDeleteButton.style.background = 'red';
            layerDeleteButton.style.color = 'white';
            layerDeleteButton.style.border = 'none';
            layerDeleteButton.addEventListener('click', () => {
                console.log("Button to be worked on");
                // removeLayer(currentLayerIndex.current);
            });
            layerPreviewContainer.appendChild(layerDeleteButton);
            const layerCanvasButton = document.createElement('button');
            const layerCanvas = document.createElement('canvas');
            layerCanvas.width = 800;
            layerCanvas.height = 600;
            const ctx = layerCanvas.getContext('2d');
            if (!ctx) return;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.lineCap = 'round';
            //resize the preview canvas to be smaller
            layerCanvas.style.width = '160px';
            layerCanvas.style.height = '120px';
            layerCanvasButton.appendChild(layerCanvas);
            var index=canvasLayers.current.length-1;
            layerCanvasButton.addEventListener('click', () => {
                switchLayers(index);
            });
            layerPreviewContainer.style.position = 'relative';
            layerPreviewContainer.appendChild(layerCanvasButton);
            layerPreviewContainer.id = `layer-${currentLayerIndex.current}`;
            layerPreviewContainer.className = 'layer';
            //Make sure the order of the frame previews is correct by inserting the new preview at the correct index
            const layerHolder = layerHandler.current;
            if (!layerHolder) return;
            layerHolder.appendChild(layerPreviewContainer);

    }
    function switchLayers(index:number){
        canvasLayers.current[currentLayerIndex.current]=paths.current;
        clearCanvas();
        const canvasLayerElements=layersDivRef.current.querySelectorAll('.canvas')
        for(let i=0;i<canvasLayerElements.length;i++){
            console.log(i, index, currentLayerIndex);
            if(canvasLayerElements[i].id==`Mainlayer-${currentLayerIndex.current+1}`){
                console.log(`Mainlayer-${currentLayerIndex.current+1}`);
    
                const canvas=canvasLayerElements[i];
               const ctx=canvasLayerElements[i].getContext('2d');
               ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i=0;i<paths.current.length;i++){
                     let map = paths.current[i];
            // console.log(map);
                    map.forEach(function (value, key){
                        if (value == null)return;
                        ctx.fillStyle = key.fillStyle;
                        ctx.strokeStyle = key.strokeStyle;
                        ctx.lineWidth = key.lineWidth;
                        ctx.lineCap  = key.lineCap;
                        ctx.stroke(value);
                    });
                }
                continue;
            }
            if (canvasLayerElements[i].id==`Mainlayer-${index+1}`){
                console.log(""+canvasLayerElements[i].id+" Index not console index")
                const canvas=canvasLayerElements[i];
               const ctx=canvasLayerElements[i].getContext('2d');
               ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        currentLayerIndex.current=index;
        paths.current=canvasLayers.current[index]
        if(paths.current==null){
            paths.current=[];
        }
        console.log(paths.current);
        redrawCanvas();
    }
    function moveLayers(){

    }
/*
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
*/
    
    
    //Mouse functions
    function getMousePos(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        
        return {
            x: (e.clientX - rect.left) / currentScale.current,
            y: (e.clientY - rect.top) / currentScale.current,
        };
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (isMovingCanvas.current) return; // Don't start drawing if we're moving the canvas
        // if (toolMode.current == "pen"){
        //     // Reset the undone paths when starting a new path
        //     undonePaths.current = [];
        //     isDrawing.current = true;
        //     lastPos.current = getMousePos(e);
        //     p.current = new Path2D();
        // }
        // if(toolMode.current == "line"){
        //     lastPos.current = getMousePos(e);
        //     startFinishLine(lastPos.current);
        // }
        Tool.canvas = canvasRef.current;
        Tool.scale = currentScale.current;
        const tool = tools.get(toolMode.current);
        tool.down(e);
        
        if (tool.actionFinished == 2){
            // Save the frame after finishing a action
            paths.current.push(tool.exportActionMap());
            saveFrame(); 
            tool.actionFinished = 0;
            undonePaths.current = []
        }
        
    }

    function handleMouseUp() {
        if(isMovingCanvas.current) return; // Don't stop drawing if we're moving the canvas
        // if(toolMode.current == "line"){
        //     console.log("lastpos: ", lastPos.current)
        //     startFinishLine(lastPos.current);
        // }
        // //Need to save the current path now!
        // if (p.current){
        //     paths.current.push(p.current);   
        // }
        // p.current = null;
        // if (toolMode.current == 'pen'){
        //     isDrawing.current = false;
        // }
        
        const tool = tools.get(toolMode.current);
        tool.up();
        if (tool.actionFinished == 2){
            // Save the frame after finishing a action
            paths.current.push(tool.exportActionMap());
            saveFrame(); 
            tool.actionFinished = 0;
            undonePaths.current = []
        }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if(isMovingCanvas.current) return; // Don't draw if we're moving the canvas
        Tool.canvas = canvasRef.current;
        Tool.scale = currentScale.current;
        const tool = tools.get(toolMode.current);
        tool.move(e);
        if (tool.actionFinished == 2){
            // Save the frame after finishing a action
            paths.current.push(tool.exportActionMap());
            saveFrame(); 
            tool.actionFinished = 0;
            undonePaths.current = []
        }
    }
    //Mouse moving canvas functions
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
        if (e.altKey){
            isDrawing.current = false;
            isMovingCanvas.current = true;
            movingCanvas.current = true;
            wasByAlt.current = true;
        }
        
    }

    function handleMouseUpMoveCanvas() {
        if (movingCanvas.current) {
            movingCanvas.current = false;
            if(wasByAlt){
                isMovingCanvas.current = false;
                wasByAlt.current = false;
            }
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
        const delta = e.deltaY;
        if (isMovingCanvas.current) {
            scaleCanvas(delta > 0 ? 0.95 : 1.05);
        }
        else{            
         
            if (e.ctrlKey){
                //scale
            scaleCanvas(delta > 0 ? 0.95 : 1.05);
            }
            else if (e.shiftKey) {
                moveCanvas(delta/10, 0);
            }
            else  {
                moveCanvas(0, -delta/10);
            }
            
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
        
        Tool.scale = currentScale.current;
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
        Tool.scale = currentScale.current;
    }
    //undo redo
    function undo(){
        const lastPath = paths.current.pop();
        if (lastPath) {
            undonePaths.current.push(lastPath);
            redrawCanvas();
        }
        console.log("UNDO")
    }
    function redo(){
        const lastUndonePath = undonePaths.current.pop();
        if (lastUndonePath) {
            paths.current.push(lastUndonePath);
            redrawCanvas();
        }
        console.log("REDO")
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
    //CSS related functions
    function openCloseToolProperties(){
        const menu = toolPropertiesMenu.current;
        if (!menu) return;
        console.log("Opening/Closing Tool Properties Menu");
        console.log(menu.classList);
        if (menu.classList.contains('closed')){
            menu.classList.remove('closed');
            menu.classList.add('open');
        }
        else if (menu.classList.contains('open')){
            menu.classList.remove('open');
            menu.classList.add('closed');
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
                    ref={backgroundCanvasRef}
                    width={800}
                    height={600}
                />
                <div className="canvasLayers" ref={layersDivRef}>

                </div>
                <canvas className='canvas'
                    ref={canvasOnionRef}
                    width={800}
                    height={600}
                />
                <div className="currentCanvasLayer">
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
        </div>
        <div className="dc-vert-container" ref={historyHandler}>
            <h3>History of Paths</h3>
            <div className="dc-vert-container historyButtons">
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
            </div>
        </div>
        <div className="dc-vert-container animationHandler" ref ={animationHandler}>
        <h3>Animation Handler</h3>
        <div className="dc-hor-container animationButtons">
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
        </div>
        </div>
        <button onClick={()=>{createLayer()}}>Create Layer</button>
        <div className='dc-vert-container' ref={framesHandler}></div>
        <div className='dc-vert-container' ref={layerHandler}></div>
        <div className='dc-vert-container tools-handler' ref={toolsHandler}>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                toolMode.current = "pen"
            }}>
               Pen Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                toolMode.current = "line"
            }}>
               Line Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                toolMode.current = "shape"
                
            }}>
               Shape Tool 
            </button>
            <div className="colorInputContainer">
                <div className="colorInput">
                    <input
                    height="100px"
                    width="100px"
                    ref={inputPrimary}
                    type="color"
                    id="primary-color"
                    name="primary-color"
                    defaultValue="#e66465"
                    onChange={()=>{
                        Tool.colorPrimary = inputPrimary.current.value;
                    }}
                    />
                </div>
                <div className="colorInput colorInputSecondary">
                    <input
                    height="100px"
                    width="100px"
                    ref={inputSecondary}
                    type="color"
                    id="secondary-color"
                    name="secondary-color"
                    defaultValue="oklab(50% 0.1 0.1 / 0.5)"
                    onChange={()=>{
                        Tool.colorSecondary = inputSecondary.current.value;
                    }}
                    />
                </div>
            </div>
        </div>
        <div className="tool-properties-menu closed" ref={toolPropertiesMenu}>
            <div className="dc-vert-container">
                <div className="tool-properties-title" ><button className="div-like-clickable-button" onClick={() => {openCloseToolProperties()}}><h3>Tool Properties</h3><FaCog id='fa-cog' /></button></div>
            </div>
        </div>
    </div>
    );
}
export default DrawingCanvas;