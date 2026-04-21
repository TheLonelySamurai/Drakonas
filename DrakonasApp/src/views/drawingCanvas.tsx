
import { useRef, useEffect } from 'react';
import { Menu, webContents } from 'electron';
import { IconBase } from 'react-icons/lib';
import { FaCog } from 'react-icons/fa';
import '../css/drawingCanvas.css';
import Tool from "../classes/Tool";
import Pen from "../classes/PenTool";
import Line from "../classes/LineTool";
import Shape from "../classes/ShapeTool";
import Eraser from "../classes/EraserTool";
import StrokeSettings from '../classes/StrokeSettings';
function DrawingCanvas() {
    //Canvases
    //const refName = useRef<Type | null>(initialValue);
    const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasOnionRef = useRef<HTMLCanvasElement | null>(null);
    //Layers
    const layersDivRef = useRef<HTMLDivElement | null>(null);
    const currentLayerDivRef = useRef<HTMLDivElement | null>(null);
    const canvasLayers = useRef<Map<StrokeSettings,Object>[][]>([[]]);// Array of paths for each layer, each path is a map of stroke settings and the path itself
    const currentLayerIndex=useRef(0);
    //Section Handlers
    const framesHandler = useRef<HTMLDivElement | null>(null);
    const historyHandler = useRef<HTMLDivElement | null>(null);
    const animationHandler = useRef<HTMLDivElement | null>(null);
    const toolsHandler = useRef<HTMLDivElement | null>(null);
    const toolPropertiesMenu = useRef<HTMLDivElement | null>(null);
    const toolPropertiesMenuFormDiv = useRef<HTMLDivElement | null>(null);
    const toolPropertiesStyle = useRef<HTMLStyleElement | null>(null);
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
    tools.set("eraser",new Eraser());
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
    const paths = useRef<Map<StrokeSettings,Object>[]>([]);
    const undonePaths = useRef<Map<StrokeSettings,Object>[]>([]);
    const frames = useRef<Map<StrokeSettings, Object>[][][]>([]); // Array of frames, each frame is an array an array of paths
    const currentFrameIndex = useRef(0);
    
    useEffect(() => {
        //  localStorage.clear();
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
        }
        const workshopHolder = document.querySelector('.workshop') as HTMLElement;
        if (workshopHolder){
            workshopHolder.appendChild(toolPropertiesMenu.current);
        }
        const canvas = canvasRef.current;
        Tool.canvas = canvas;
        Tool.scale = currentScale.current; 
        Tool.colorPrimary = inputPrimary.current.value;
        Tool.colorSecondary = inputSecondary.current.value;
        
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        createToolPropertiesMenuForm();
        const savedFrames=localStorage.getItem("frames")
        const currentFrame=localStorage.getItem("current_frame");
        const currentLayer=localStorage.getItem("current_layer");
        console.log(savedFrames);
        if(savedFrames && currentFrame && currentLayer){
          load(currentFrame,currentLayer,savedFrames)  
          drawBackground();
            for (let i=0;i<frames.current.length;i++){
                addPreviewFrameToFramesHandler(i);
            }
            loadFrame(currentFrameIndex.current);
            for (let i=0;i<canvasLayers.current.length;i++){
                addLayerPreview(i);
            }
            switchLayers(currentLayerIndex.current);
        }
        else{
        clearCanvas();
        clearOnionSkin();
        drawBackground();
        createLayer();
        saveLayer();
        addPreviewFrameToFramesHandler(0);//Add the first frame to the preview
        saveFrame();
        }
       
        // resizeDrawingApp(); Still In Progress, it resizees the drawing app but alongside it the canvas changes dimensions and deletes its contents, so it is currently disabled until I can find a solution to that issue
        moveCanvas(canvasHolder.clientWidth/2 - canvas.width/2, drawingApp.clientHeight/2 - canvas.height/2);
        const removeUndo = window.historyAPI.onUndo(() => undo());
        const removeRedo = window.historyAPI.onRedo(() => redo());
        return () => {
            removeUndo();
            removeRedo();
        };
    }, []);
    //Save to memory function 

    //Frame Related
        // function saveFrame() {
        //     // Save the current paths into the current frame
        //     frames.current[currentFrameIndex.current] = [...canvasLayers.current];
        //     // Update the preview for this frame
        //     addPreviewFrameToFramesHandler(currentFrameIndex.current);

        // }
        //restored
        function saveFrame() {
            // Save the current paths into the current frame
            frames.current[currentFrameIndex.current] = [...canvasLayers.current];

            // Update the preview for this frame
            updatePreviewFrame(currentFrameIndex.current);
            save();
        }
        // function newFrame() {
        //     saveFrame(); // Save the current frame before creating a new one
        //     currentFrameIndex.current = frames.current.length ; // Move to the new frame
        //     clearCanvas();
        //     if (onionSkinEnabled.current){
        //         clearOnionSkin();
        //         loadOnionSkin(currentFrameIndex.current - 1);
        //     }
        //     paths.current = []; // Clear current paths for the new frame
        //     const canvasLayersLength = canvasLayers.current.length;
        //     canvasLayers.current = []; // Clear current layers
        //     for (let i = 0; i < canvasLayersLength; i++){
        //         canvasLayers.current.push([]); // Add empty layers for the new frame
        //     }
        //     scaleCanvas(1);//Ensure the layer canvases are the correct size
        //     redrawAllLayers();
        //     saveFrame(); // Save the new frame (which is currently empty)
        // }
        //restored
        function newFrame() {
            saveFrame(); // Save the current frame before creating a new one
            currentFrameIndex.current = frames.current.length ; // Move to the new frame
            clearCanvas();
            if (onionSkinEnabled.current){
                clearOnionSkin();
                loadOnionSkin(currentFrameIndex.current - 1);
            }

            paths.current = []; // Clear current paths for the new frame
            const canvasLayersLength = canvasLayers.current.length;
            canvasLayers.current = []; // Clear current layers
            for (let i = 0; i < canvasLayersLength; i++){
                canvasLayers.current.push([]); // Add empty layers for the new frame
            }
            scaleCanvas(1);//Ensure the layer canvases are the correct size
            redrawAllLayers();
            addPreviewFrameToFramesHandler(currentFrameIndex.current); // Add a preview for the new frame
            saveFrame(); // Save the new frame (which is currently empty)
            updateAllPreviewLayers(); // Update the layer previews to reflect the new frame's layers (which are currently empty)
        }
        // function loadFrame(index: number) {
        //     if (index < 0 || index >= frames.current.length) return;
        //     currentFrameIndex.current = index;
        //     canvasLayers.current = [...frames.current[index]]; // Load the paths for the selected frame
        //     paths.current = canvasLayers.current[currentLayerIndex.current] || [];
        //     redrawAllLayers();
        //     if(onionSkinEnabled.current){
        //         clearOnionSkin();
        //         loadOnionSkin(index - 1);
        //     }
        // }
        //restored
        
        function loadFrame(index: number) {
            if (index < 0 || index >= frames.current.length) return;
            currentFrameIndex.current = index;
            redrawCanvas();
            canvasLayers.current = [...frames.current[index]]; // Load the paths for the selected frame
            if (!layersDivRef.current) return;
            const canvasLayerElements=layersDivRef.current.querySelectorAll('.canvas')
            
            if (canvasLayers.current.length < canvasLayerElements.length) {
                // Handle the case where there are fewer layers than expected
                for (let i = canvasLayers.current.length; i < canvasLayerElements.length; i++) {
                    //Add a new layer to the frames data
                    canvasLayers.current.push([]);
                }
                frames.current[index] = [...canvasLayers.current]; // Update the current frame data with the new layer
            }
            
            paths.current = canvasLayers.current[currentLayerIndex.current] || [];
            redrawAllLayers();
            if(onionSkinEnabled.current){
                clearOnionSkin();
                loadOnionSkin(index - 1);
            }
            updateAllPreviewLayers();
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
        function updateAllPreviewFrames(){
            //Occurs on Layer Deletion, as the frame previews need to be updated to reflect the change in layers for each frame, so we just redraw all of the previews for each frame
            const framesHolder = framesHandler.current;
            if (!framesHolder) return;
            const previewCanvases = framesHolder.querySelectorAll('.frame');
            previewCanvases.forEach((canvas, index) => {
                drawFromAllLayers(canvas.querySelector('canvas'), frames.current[index]);
            });
        }
        function updatePreviewFrame(frameIndex: number){
            const previewCanvas = document.querySelector(`#frame-${frameIndex} canvas`) as HTMLCanvasElement;
            if (!previewCanvas) return;
            drawFromAllLayers(previewCanvas, frames.current[frameIndex]);
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
            if (frames.current[frameIndex]) {
                drawFromAllLayers(frameCanvas, frames.current[frameIndex]);
            }
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
            if (!canvas) return;
            canvas.style.opacity = '0.5';
            drawFromAllLayers(canvas, frames.current[index]);
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
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    //Canvas related functions
        function clearCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        function drawFromAllLayers(canvas : HTMLCanvasElement, layers: Map<StrokeSettings, Object>[][]){
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            for (let i = 0; i < layers.length; i++){
                const pathsToDraw = layers[i];
                for(let i = 0; i < pathsToDraw.length; i ++){
                    let map = pathsToDraw[i];
                    // console.log(map);
                    map.forEach(function (value, key){
                        // console.log("KEY: " + key + " | VALUE: " + value)
                        if (value.path == null)return;
                        // console.log(key);
                        // console.log(value)
                        ctx.fillStyle = key.fillStyle;
                        ctx.strokeStyle = key.strokeStyle;
                        ctx.lineWidth = key.lineWidth;
                        ctx.lineCap  = key.lineCap;
                        if(key.globalAlpha)ctx.globalAlpha = key.globalAlpha;
                        ctx.stroke(value.path);
                    });
                }
            }
        }
        function redrawAllLayers(){
            //When changing frames, the frames data contains the data for all layers, so we need to redraw all layers for the current frame
            // This function occurs when canvasLayers is already updated with the new frame data, so we just need to redraw all layers in canvasLayers
            // The format for layers is odd, as we have a top layer canvas that is the current layer we are working with, and all of the other layers that are behind it
           
            //Redraw all of the other layers on their respective canvases
            if (!layersDivRef.current)return;
            const canvasLayerElements=layersDivRef.current.querySelectorAll('.canvas');
            //Each .canvas element corresponds to a layer, the index of the .canvas element corresponds to the index of the layer in canvasLayers, so we can use that to redraw each layer on its respective canvas
            //In the cases that the number of layers from previous frames is not up to current, we just skip drawing those layers as they are empty and do not need to be drawn
            //This shouldn't have issues for when there are MORE layers as the  
            for(let i = 0; i < canvasLayerElements.length; i ++){''
                const layerCanvas = canvasLayerElements[i] as HTMLCanvasElement;
                const layerPaths = canvasLayers.current[i];
                //Clear the layer canvas before redrawing
                const ctx = layerCanvas.getContext('2d');
                if (!ctx) return;
                ctx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
                drawAnyCanvas(layerCanvas, layerPaths);
            }
            switchLayers(currentLayerIndex.current);
        }
        function redrawCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            console.log("Redrawing canvas with paths: ", paths.current);
            clearCanvas();
            // console.log("PATHS + " +paths.current);
            for(let i = 0; i < paths.current.length; i ++){
                let map = paths.current[i];
                console.log(paths.current);
                if(map instanceof Array){
                    console.log("Array");
                    
                }
                if(map instanceof Map){
                    console.log("Map");
                }
                map.forEach(function (value, key){
                    // console.log("KEY: " + key + " | VALUE: " + value)
                    if (value.path == null)return;
                    // console.log(key);
                    // console.log(value)
                    ctx.fillStyle = key.fillStyle;
                    ctx.strokeStyle = key.strokeStyle;
                    ctx.lineWidth = key.lineWidth; 
                    ctx.lineCap  = key.lineCap;
                    if(key.globalAlpha)ctx.globalAlpha = key.globalAlpha;
                    ctx.stroke(value.path);
                });
            }
        }
        function drawAnyCanvas(canvas : HTMLCanvasElement, pathsToDraw: Map<StrokeSettings, Object>[]){
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            console.log("Redrawing canvas with paths: ", paths.current);
            ctx.clearRect(0,0, canvas.width, canvas.height)
            // console.log("PATHS + " +paths.current);
            for(let i = 0; i < pathsToDraw.length; i ++){
                let map = pathsToDraw[i];
                // console.log(map);
                map.forEach(function (value, key){
                    // console.log("KEY: " + key + " | VALUE: " + value)
                    if (value.path == null)return;
                    // console.log(key);
                    // console.log(value)
                    ctx.fillStyle = key.fillStyle;
                    ctx.strokeStyle = key.strokeStyle;
                    ctx.lineWidth = key.lineWidth;
                    ctx.lineCap  = key.lineCap;
                    if(key.globalAlpha)ctx.globalAlpha = key.globalAlpha;
                    ctx.stroke(value.path);
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
            if (!layersDivRef.current)return;
            layersDivRef.current.appendChild(layer);
            addLayerPreview();
            canvasLayers.current.push([]);
        }
        // function saveLayer(){ 
        //     //Save the current layer paths into the canvasLayers array
        //     canvasLayers.current[currentLayerIndex.current] = [...paths.current];
        // }
        //restored
        
        function saveLayer(){
            //Save the current layer paths into the canvasLayers array
            canvasLayers.current[currentLayerIndex.current] = [...paths.current];
            //Load the preview layer canvas with the new layer data
            updatePreviewLayer(currentLayerIndex.current);
            console.log("Saving layer at index: ", currentLayerIndex.current);
        }
        function removePreviewLayer(index: number){
            const layersHolder = layerHandler.current?.querySelector('.layerHolder');
            if (!layersHolder) return;
            const previewCanvases = layersHolder.querySelectorAll('.layer');
            if (index < 0 || index >= canvasLayers.current.length) return;
            previewCanvases.forEach((canvas) => {
                if (canvas.id === `layer-${index}`) {
                    layersHolder.removeChild(canvas);
                }
            });
        }
        function updateAllPreviewLayers(){
            //Occurs on frame change or deletion, as the layer previews need to be updated to reflect the change in layers for the current frame, so we just redraw all of the previews for each layer
            for (let i = 0; i < canvasLayers.current.length; i++){
                updatePreviewLayer(i);
            }
        }

        function updatePreviewLayer(index: number){
            const previewCanvas = document.querySelector(`#layer-${index} canvas`) as HTMLCanvasElement;
            if (!previewCanvas) return;
            drawAnyCanvas(previewCanvas, canvasLayers.current[index]);
        }

        function addLayerPreview(index?:number){
            const i = index !== undefined ? index : canvasLayers.current.length - 1;
            const layerPreviewContainer = document.createElement('div');
                const layerLabel = document.createElement('div');
                layerLabel.textContent = `Layer ${i+1}`;
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
                    deleteLayer(currentLayerIndex.current); 
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
                drawAnyCanvas(layerCanvas, canvasLayers.current[i])
                //resize the preview canvas to be smaller
                layerCanvas.style.width = '160px';
                layerCanvas.style.height = '120px';
                layerCanvasButton.appendChild(layerCanvas);
                layerCanvasButton.addEventListener('click', () => {
                    switchLayers(i);
                });
                layerPreviewContainer.style.position = 'relative';
                layerPreviewContainer.appendChild(layerCanvasButton);
                layerPreviewContainer.id = `layer-${i}`;
                layerPreviewContainer.className = 'layer';
                //Make sure the order of the frame previews is correct by inserting the new preview at the correct index
                const layerHolder = layerHandler.current?.getElementsByClassName('layerHolder')[0];
                if (!layerHolder) return;
                layerHolder.appendChild(layerPreviewContainer);
 
        }
        function switchLayers(index:number){
            scaleCanvas(1);//Ensure the layer canvases are the correct size
            canvasLayers.current[currentLayerIndex.current]=paths.current;
            clearCanvas();
            if (!layersDivRef.current) return;
            const canvasLayerElements=layersDivRef.current.querySelectorAll('.canvas')
            for(let i=0;i<canvasLayerElements.length;i++){
                console.log(i, index, currentLayerIndex);
                if(canvasLayerElements[i].id==`Mainlayer-${currentLayerIndex.current+1}`){
                    console.log(`Mainlayer-${currentLayerIndex.current+1}`);
        
                    const canvas=canvasLayerElements[i];
                    drawAnyCanvas(canvas, paths.current);
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
            console.log("Switched to layer index: ", index);
            redrawCanvas();
        }
        function deleteLayer(index:number){
            //Remove the layer from the canvasLayers array
            canvasLayers.current.splice(index, 1);
            //Remove the layer then from all frames in the frames array
            frames.current.forEach(frame => {
                frame.splice(index, 1);
            });
            //Remove the layer canvas from the layers div
            const canvasLayerElements=layersDivRef.current?.querySelectorAll('.canvas');
            canvasLayerElements?.forEach((canvas) => {
                if (canvas.id === `Mainlayer-${index+1}`) {
                    layersDivRef.current?.removeChild(canvas);
                }
            });
            //Finally, remove the layer preview from the layer handler
            deleteLayerPreview(index);
            //Ensure the current layer index is updated accordingly and the correct layer is displayed after deletion
            if (currentLayerIndex.current >= canvasLayers.current.length) {
                currentLayerIndex.current = Math.max(0, canvasLayers.current.length - 1);
            }
            switchLayers(currentLayerIndex.current);
        }
        function deleteLayerPreview(index:number){ 
            //This function actually removes ALL layer previews and redraws them, 
            //this is because the layer previews need to be updated after a layer 
            //is removed to ensure the correct layer corresponds to the correct preview, 
            //so it is easier to just redraw them all with the correct information rather 
            //than trying to just remove one preview and update the rest
            const handler = layerHandler.current;
            if (!handler) return;
            //This function happens AFTER deleteLayer, so the layer at index has already been removed from canvasLayers and frames, so we just need to redraw the previews for the remaining layers
            const layerHolder = handler.querySelector('.layerHolder');
            if (!layerHolder) return;
            layerHolder.innerHTML = '';
            for (let i = 0; i < canvasLayers.current.length; i++){
                addLayerPreview(i);
            }
        }
        function moveLayers(){
            //Move layers up and down in the layer stack, this will change the order they are drawn in which will change how they overlap with each other
        }
        function save(){
            //Save the current data of the frames, layers, and their properties.
            //Also fetch tool preferences from the Tool classes and save those as well
            //Save the
            const frames_copy: any[]=[];
            frames.current.map((layer, index)=>{
                var layers_copy: any[]=[];
                layer.map((paths,index2)=>{
                    var paths_copy:any[]=[]
                    paths.map((path, index3)=>{
                        var path_map:any[]=[]
                        path.forEach((value,key)=>{
                            var object={
                                stroke:JSON.stringify(key),
                                path:value.svgStr
                            };
                            path_map.push(object);
                        })
                        paths_copy.push(path_map);
                    });
                    layers_copy.push(paths_copy);
                });
                frames_copy.push(layers_copy);
            });
            // frames.current.forEach((layer,index)=>{
            //     var layers_copy: any[]=[];
            //     for(let i=0;i<layer.length;i++){
            //         var paths_copy: any[]=[]
            //         for(let f=0;f<layer[i].length;f++){
            //             var path_map:any[]=[]
            //             layer[i][f].forEach((value,key)=>{
            //                 var object={
            //                     stroke:JSON.stringify(key),
            //                     path:value.svgStr
            //                 };
            //                 path_map.push(object);
            //             })
                        
            //             paths_copy.push(path_map);
            //         }
            //         layers_copy.push(paths_copy);
            //     } 
            // frames_copy.push(layers_copy);
            // }
            //    ); 
            localStorage.setItem("frames",JSON.stringify(frames_copy));
            localStorage.setItem("current_frame",JSON.stringify(currentFrameIndex.current));
            localStorage.setItem("current_layer",JSON.stringify(currentLayerIndex.current));
        }
        function load(currentFrame:string,currentLayer:string,savedFrames:string){
            currentFrameIndex.current=JSON.parse(currentFrame) ;
            currentLayerIndex.current=JSON.parse(currentLayer);
            const rewritten_map: any[]=[];
            const current_frames=JSON.parse(savedFrames);
            current_frames.forEach((layer)=>
            {
                const layers:any[]=[];
               for(let i=0;i<layer.length;i++){
                const maps:any[]=[];
                for (let t=0;t<layer[i].length;t++){
                    if(layer[i][t]!=null){
                        var path_map = layer[i][t];
                        var map=new Map<StrokeSettings,Object>()
                       for(let j = 0; j < path_map.length;j++){
                        console.log(path_map[j])
                        if(!path_map[j].stroke || !path_map[j].path){
                            console.log("Skipped")
                            continue;
                        }
                        
                        var strokeSet:StrokeSettings=JSON.parse(path_map[j].stroke);
                        var path=new Path2D(path_map[j].path)
                        var object={
                            path:path,
                            svgStr:path_map[j].path
                        }
                        map.set(strokeSet,object)
                       }
                       maps.push(map); 
                    }
                    
                }
                layers.push(maps);
               }
                rewritten_map.push(layers) 
            }); 

            frames.current=rewritten_map;    
        }
        //EXPORT TO GIF
        async function exportToGif(){
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const frameData = frames.current.map(frameLayers => {
            
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Use your existing drawing function here
                drawFromAllLayers(canvas, frameLayers); 

                // Get raw pixel data/
                // In your Renderer component
                const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                console.log(`Sending frame: Length ${pixelData.length}, Type: ${pixelData.constructor.name}`);
                return pixelData;
            });

            window.mainFunctions.createGif({
            frames: frameData,
            width: canvas.width,
            height: canvas.height
            });
        };
        //Use Effect specifically to tell the user the gif finished downloading, will replace alert later.
        useEffect(() => {
        window.mainFunctions.onGifResult(() => {
            alert("GIF saved to your computer!");
        });
        }, []);

    // function exportToGif(){
    //     console.log("Exporting to GIF with frames: ", frames.current.length);
    //     console.log("Frames data: ", frames.current);
    //     const exportCanvas = document.createElement("canvas");
    //     exportCanvas.width = 800;
    //     exportCanvas.height = 600;
    //     const exportCtx = exportCanvas.getContext("2d");
    //     if (!exportCtx) return;

    //     const gif = new GIF({
    //         workers: 2,
    //         quality: 10,
    //         width: 800,
    //         height: 600,
    //         workerScript: '../other/gif.worker.js'
    //     });

    //     for (let i = 0; i < frames.current.length; i++) {  
    //         exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    //         exportCtx.fillStyle = 'white';
    //         exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    //         drawFromAllLayers(exportCanvas, frames.current[i]);
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
            saveLayer();
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
            saveLayer();
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
            saveLayer();
            saveFrame(); 
            tool.actionFinished = 0;
            undonePaths.current = []
        }
    }
//Mouse moving canvas functions
// These functions are in the space that the canvas is contained within
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
        var canvases = canvasContainer.querySelectorAll('canvas');
        
        
        currentScale.current *= scaleFactor;
        canvases.forEach(canvas => {
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const offsetX = (centerX - window.innerWidth / 2) * (scaleFactor - 1);
            const offsetY = (centerY - window.innerHeight / 2) * (scaleFactor - 1);
            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale.current})`;
        });
        
        if (layersDivRef.current != null) {
            const canvasLayers = layersDivRef.current.querySelectorAll('canvas');
            canvasLayers.forEach(canvas => {
                const rect = canvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const offsetX = (centerX - window.innerWidth / 2) * (scaleFactor - 1);
                const offsetY = (centerY - window.innerHeight / 2) * (scaleFactor - 1);
                canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale.current})`;
            });
        }
        if (canvasRef.current != null) {
            const rect = canvasRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const offsetX = (centerX - window.innerWidth / 2) * (scaleFactor - 1);
            const offsetY = (centerY - window.innerHeight / 2) * (scaleFactor - 1);
            canvasRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale.current})`;
        }
        Tool.scale = currentScale.current;
    }
    function rotate(angle: number){
        const canvas=canvasRef.current;
        if (!canvas) return;
        const ctx=canvas.getContext('2d');
        if (!ctx) return;
        clearCanvas();
        ctx.translate(canvas.width/2,canvas.height/2);
       ctx.rotate(angle);
        redrawCanvas();
        ctx.rotate(-angle);
        ctx.translate(-(canvas.width/2),-(canvas.height/2));
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
// Tool Functions
    function swapTool(newTool: string){
        toolMode.current = newTool;
        createToolPropertiesMenuForm();
    }
//CSS related functions
    function moveCanvasButton(){
        if (isMovingCanvas.current) {
            isMovingCanvas.current = false;
            document.querySelector('#moveCanvasButton').textContent = "Move Canvas";
        } else {
            isMovingCanvas.current = true;
            document.querySelector('#moveCanvasButton').textContent = "Stop Moving Canvas";
        }
    }
    function openCloseToolProperties(){
        const menu = toolPropertiesMenu.current;
        if (!menu) return;
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
    //Tool Properties Menu
    function createToolPropertiesMenuForm(){
        const menuHolder = toolPropertiesMenuFormDiv.current;
        if (!menuHolder) return;
        menuHolder.innerHTML = ''; // Clear previous menu
        const form = document.createElement('form');
        form.className = "tool-properties-form";
        //Add inputs to the form based on the current tool
        const tool = tools.get(toolMode.current);
        /* tool.exportProperties() returns JSON in the following format:
            {
                <insert order number>: <Property Name> : <input type>,
            }
                where the input type can be "color", "number", "select" (for dropdowns), or "checkbox"
                "select" input types also include an array of options for the dropdown menu in the following format:
            {
                <insert order number>: <Property Name> : {
                    type: "select",
                    options: [<option 1>, <option 2>, ...]
                }
            }
            
        */
        if (!tool) return;
        var header = document.createElement('h3');
        header.textContent = `${tool.name} Properties`;
        form.appendChild(header);
        const properties = tool.exportProperties();
        const propertyKeys = Object.keys(properties).sort((a, b) => parseInt(a) - parseInt(b));
        propertyKeys.forEach(key => {
            const property = properties[key];
            const type = property.type;
            console.log("Creating input for property: ", property, "From key: ", key);
            const label = document.createElement('label');
            label.textContent = property.name;
            form.appendChild(label);
            let input : HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = document.createElement('input');
            switch (type.type) {
                case "color":
                    input = document.createElement('input');
                    input.type = 'color';
                    input.value = "#000";
                    if (type.default !== undefined) input.value = type.default;
                    input.addEventListener('change', () => {
                        tool.updateProperty(property.name, input.value);
                    });
                    break;
                case "number":
                    input = document.createElement('input');
                    input.type = 'number';
                    input.addEventListener('change', () => {
                        tool.updateProperty(property.name, input.value);
                    });
                    if (type.min !== undefined) input.min = type.min;
                    if (type.max !== undefined) input.max = type.max;
                    if (type.step !== undefined) input.step = type.step;
                    if(type.default !== undefined) input.defaultValue = type.default;
                    else input.defaultValue = tool.getProperty(property.name);
                    break;
                case "select":
                    input = document.createElement('select');
                    type.options.forEach((option: string) => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        if (option === tool.getProperty(property.name)) {
                            optionElement.selected = true;
                        }
                        input.appendChild(optionElement);
                    });
                    input.addEventListener('change', () => {
                        tool.updateProperty(property.name, input.value);
                    });
                    break;
                case "checkbox":
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = type.defaultValue || false;
                    input.addEventListener('change', () => {
                        tool.updateProperty(property.name, input.checked);
                    });
                    break;
                default:
                    console.warn(`Unknown property type: ${property.type}`);
            }
            form.appendChild(input);
        });
        //Fade In animation of the form
        form.style.animation = 'fadeIn 0.3s ease-out forwards';
        //Dynamic height of the menu based on the number of properties (max height of 400px with scroll)
        const menuHeight = Math.max(200, propertyKeys.length * 2 * 60 + 200);
        const menuContainer = toolPropertiesMenu.current;
        if (!menuContainer) {
            menuHolder.appendChild(form);
            return;
        }
        
        var r = document.querySelector(':root');
        r.style.setProperty('--menu-height', `${menuHeight}px`);
        menuContainer.style.height = `var(--menu-height)`;
        menuContainer.style.overflowY = (propertyKeys.length * 60 + 200) > 500 ? 'scroll' : 'hidden';
        
        menuHolder.appendChild(form);
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
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            exportToGif();
        }}>
            Export to GIF
        </button>
        </div>
        </div>
        
        <div className='dc-vert-container' ref={framesHandler}></div>
        <div className='dc-vert-container' ref={layerHandler}>
            <button onClick={()=>{createLayer()}}>Create Layer</button>
            <div className="layerHolder">

            </div>
            <div className="backgroundLayerPreviewHolder">

            </div>
            <div className="layerSettingsBar">

            </div>
        </div>
        <div className='dc-vert-container tools-handler' ref={toolsHandler}>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                swapTool("pen");
            }}>
               Pen Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                swapTool("line");
            }}>
               Line Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                toolMode.current = "eraser"
            }}>
               Eraser Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                toolMode.current = "eraser";
            }}>
               Eraser Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                swapTool("shape");
            }}>
               Shape Tool 
            </button>
            <button className="toolbar-button" onClick={() => {
                rotate(30);  
            }}>
               Rotate Tool 
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
                <div className="tool-properties-title" ><button className="div-like-clickable-button" onClick={() => {openCloseToolProperties()}}><h3>Tool Properties</h3></button></div>
                <div className="tool-properties-content" ref={toolPropertiesMenuFormDiv}>
                </div>
            </div>
        </div>
    </div>
    );
}
export default DrawingCanvas;