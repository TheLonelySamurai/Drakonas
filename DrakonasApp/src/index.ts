import { app, BrowserWindow, Menu, ipcMain, screen, session, dialog } from 'electron';
import menu  from './menu';
import { spawn, ChildProcess } from "child_process";
import path from "path";
import ProjectPage from './views/ProjectPage'
import fs from 'fs';
import os from 'os';
import * as path from 'path';
import AdmZip from 'adm-zip';
import GifEncoder from 'gif-encoder';
// import HME from 'h264-mp4-encoder'; 

ipcMain.handle("save-to-zip", async (event, {fileName, data, layerSettings, toolSettings})=>{
   // 1. Let the user choose where to save the file
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save Project', 
    defaultPath: `${fileName}.drkns`, // Use your custom extension
    filters: [{ name: 'Custom Zip Files', extensions: ['drkns'] }]
  });

  if (filePath) {
    const zip = new AdmZip();
    
    // 2. Add content (e.g., a JSON file containing your React state)
    const content = JSON.stringify({animationData: data, layerData: layerSettings, toolData: toolSettings});
    zip.addFile("project.json", Buffer.from(content, "utf8"));
  
    // 3. Write the zip file to the chosen path 
    zip.writeZip(filePath);
    return { success: true, path: filePath };
    /*
    file = null
    fs.readdir(temporaryDirectory, (err, files)=>{
      if (err){
        return (console.error("unable to scan directory" + err))
      }
      file = files[0]
    })
    Your stuff body: file
    */
  }
  return { success: false };
})

ipcMain.handle("load-from-local-zip", async () =>{
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Custom Project', extensions: ['drkns'] }],
    properties: ['openFile']
  });

  if (canceled || filePaths.length === 0) return null;

  try {
    // AdmZip can read the file regardless of its extension (.drkns / .drakz)
    const zip = new AdmZip(filePaths[0]);
    
    // Read the specific internal file as text
    const zipEntry = zip.getEntry("project.json");

    if (!zipEntry) {
      // This helps you debug: it lists what IS actually inside the zip
      const entries = zip.getEntries().map(e => e.entryName);
      throw new Error(`Entry "project.json" not found. Contents: ${entries.join(', ')}`);
    }
    if (!zipEntry) throw new Error("Invalid project file: project.json missing.");

    const content = zip.readAsText(zipEntry);
    return JSON.parse(content); // Return the object to the Renderer
  } catch (error) {
    console.error("Failed to load:", error);
    throw error;
  }
})
ipcMain.handle("save-to-database", async (event, {fileName, data, layerSettings, toolSettings, userId, userSessionId})=>{
  console.log("Save to Database");
    const content = JSON.stringify({animationData: data, layerData: layerSettings, toolData: toolSettings});

    const projectData=new FormData;
    projectData.append('project_name',fileName);
     console.log("File found: "+(content!=null));
    if(content==null)return;
    projectData.append('project_data',content);
    //                           "http://localhost:38451/api/"
    const creation = await fetch('http://localhost:38451/api/create-project',{
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
    },
    body:new URLSearchParams({
      project_name:fileName,
      project_data:content,
      user_id: userId,
      user_session: userSessionId || ''
    })
  });
  if (!creation.ok) {
    const text = await creation.text();
    throw new Error(text);
  }
  return {success:true, data: await creation.json()};
  
  return { success: false };
})

ipcMain.handle("update-to-database", async (event, {projectId, fileName, data, layerSettings, toolSettings, userId, userSessionId})=>{
  console.log("Update to Database");
    const content = JSON.stringify({animationData: data, layerData: layerSettings, toolData: toolSettings});

    const projectData=new FormData;
    projectData.append('project_name',fileName);
     console.log("File found: "+(content!=null));
    if(content==null)return;
    projectData.append('project_data',content);
    //                           "http://localhost:38451/api/"
    const creation = await fetch('http://localhost:38451/api/save-project',{
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
    },
    body:new URLSearchParams({
      project_name:fileName,
      project_data:content,
      project_id: projectId,
      user_id: userId,
      user_session: userSessionId || ''
    })
  });
  if (!creation.ok) {
    const text = await creation.text();
    throw new Error(text);
  }
  return {success:true};
  
  return { success: false };
})
ipcMain.on('generate-vid', async (event, {frames, width, height, fps})=> {
  
    // Initialize the encoder
    const HME = await import('h264-mp4-encoder');
    const encoder = await HME.createH264MP4Encoder();
    encoder.width = width;
    encoder.height = height;
    encoder.frameRate = fps;
    encoder.initialize();

    // Add each frame of pixel data
    frames.forEach(frameData => {
        encoder.addFrameRgba(frameData);
    });

    // Finalize the encoding process
    encoder.finalize();

    const uint8Array = encoder.FS.readFile(encoder.outputFilename);

    const { filePath } = await dialog.showSaveDialog({
      title: 'Save your Video',
      defaultPath: 'animation.mp4',
      filters: [{ name: 'Videos', extensions: ['mp4'] }]
    });

    if (filePath) {
      try {
        // fs.writeFileSync handles Uint8Array or Buffer automatically
        fs.writeFileSync(filePath, uint8Array);
        event.reply("vid-finished", 'saved');

      } catch (err) {
        console.error('Failed to save video:', err);
      }
    }

    // Clean up memory
    encoder.delete();
    console.log(`Video saved successfully to: ${filePath}`);
})

ipcMain.on('generate-gif', (event, { frames, width, height, fps }) => {
  const gif = new GifEncoder(width, height);
  const chunks: Buffer[] = [];

  // 1. Setup data collection
  gif.on('data', (data: Buffer) => chunks.push(data));
  
  gif.on('end', async () => {
    const fullBuffer = Buffer.concat(chunks);
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save your GIF',
      defaultPath: 'animation.gif',
      filters: [{ name: 'Images', extensions: ['gif'] }]
    });

    if (filePath) {
      fs.writeFileSync(filePath, fullBuffer);
      event.reply('gif-finished', 'saved');
    }
  });

  // 2. Start Encoding
  gif.writeHeader();
  gif.setRepeat(0);     // 0 for loop
  gif.setDelay(1000 / fps);    // ms per frame
  gif.setQuality(10);

  frames.forEach((pixelData: any) => {
    // Reconstruct the TypedArray from the IPC data
    const pixels = new Uint8ClampedArray(Object.values(pixelData));
    gif.addFrame(pixels); 
  });

  gif.finish();
});

let javaProcess: ChildProcess | null = null;

function startJavaBackend() {
  const jarPath = path.join(process.resourcesPath, "backend.jar");
  const gcpKeyPath = path.join(process.resourcesPath, "gcp-key.json");

  javaProcess = spawn("java", ["-jar", jarPath], {
    env: {
      ...process.env,
      DRAKONAS_DB_URL: "jdbc:mysql:///drakonas?cloudSqlInstance=intrepid-alloy-448022-p1:us-central1:drakonas-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory",
      DRAKONAS_DB_USER: "admin",
      DRAKONAS_DB_PASSWORD: "}B3_E2T.LcK<|nCR",
      GOOGLE_APPLICATION_CREDENTIALS: gcpKeyPath,
    },
  });

  javaProcess.stdout.on("data", (data: any) => {
    console.log("[JAVA]", data.toString());
  });

  javaProcess.stderr.on("data", (data: any) => {
    console.error("[JAVA ERROR]", data.toString());
  });
}
async function waitForBackend() {
  for (let i = 0; i < 40; i++) {
    try {
      await fetch("http://localhost:38451/hello");
      return;
    } catch {
      await new Promise(r => setTimeout(r, 250));
    }
  }
  throw new Error("Backend failed to start");
}
function stopJavaBackend() {
  if (javaProcess) {
    javaProcess.kill();
    javaProcess = null;
  }
  spawn("taskkill", ["/F", "/IM", "java.exe"]);

}
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
// reset the application menu to be the custom one that we setup
Menu.setApplicationMenu(menu);
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "./other/favicon.ico"),
    height: height,
    width: width,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity:true
    },
    show: false
  });

  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  return mainWindow;
};
function goToProjects(){
 ProjectPage();
}
app.commandLine.appendSwitch(
  'disable-features', 
  'SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure'
);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  
  startJavaBackend();
  await waitForBackend();
  
  var win = createWindow()

  // This ensures Electron doesn't strip the cookie when moving between ports
  win.webContents.session.webRequest.onBeforeSendHeaders(
    { urls: ['http://localhost:38451/*'] },
    (details, callback) => {
      details.requestHeaders['Origin'] = 'http://localhost:3000';
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; " +
          "connect-src 'self' http://localhost:38451 ws://localhost:3000;"
        ]
      }
    });
}
);
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// Kill the Java backend when the app is closed
app.on('before-quit', () => {
  stopJavaBackend();
});
app.on("will-quit", () => {
  stopJavaBackend();
});
process.on("exit", stopJavaBackend);
process.on("SIGINT", stopJavaBackend);
process.on("SIGTERM", stopJavaBackend);


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

