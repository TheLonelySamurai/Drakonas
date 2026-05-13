// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron"
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// const { contextBridge } = require('electron')

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
//   // we can also expose variables, not just functions
// })

contextBridge.exposeInMainWorld("mainFunctions", {
  onLoginWindow: () => ipcRenderer.send("loginWindow"),
  createGif: (frames: any[]) => ipcRenderer.send("generate-gif", frames),
  createVid: (frames: any[]) => ipcRenderer.send("generate-vid", frames),
  onGifResult: (callback: any) => ipcRenderer.on("gif-finished", (_event, data) => callback(data)),
  onVidResult: (callback: any) => ipcRenderer.on("vid-finished", (_event, data) => callback(data)),
  saveToZip: (payload: { data: any, fileName: string }) => ipcRenderer.invoke('save-to-zip', payload),
  saveToDatabase: (payload: { data: any, fileName: string }) => ipcRenderer.invoke('save-to-database', payload),
  updateToDatabase: (payload: { data: any, fileName: string }) => ipcRenderer.invoke('update-to-database', payload),
  loadFromLocalZip: () => ipcRenderer.invoke("load-from-local-zip"),
  // Menu-push listeners (main → renderer)
  onMenuImport: (cb: () => void) => ipcRenderer.on('load-from-local-zip', () => cb()),
  onMenuSaveLocal: (cb: () => void) => ipcRenderer.on('save-to-local-zip', () => cb()),
  onMenuSaveDatabase: (cb: () => void) => ipcRenderer.on('save-to-database-menu', () => cb()),
  onMenuExportGif: (cb: () => void) => ipcRenderer.on('export-gif', () => cb()),
  onMenuExportMp4: (cb: () => void) => ipcRenderer.on('export-mp4', () => cb()),
});

contextBridge.exposeInMainWorld('menuNav',{
  onReturnHome: (callback: () => void) => ipcRenderer.on("projects", callback),
  onReturnToWorkshop: (callback: () => void) => ipcRenderer.on("workshop", callback),
});

contextBridge.exposeInMainWorld("historyAPI", {
  onUndo: (callback: () => void) => {
    const subscription = (_event: any) => callback();
    ipcRenderer.on("undo", subscription);
    // Return a function to remove THIS specific listener
    return () => ipcRenderer.removeListener("undo", subscription);
  },
  onRedo: (callback: () => void) => {
    const subscription = (_event: any) => callback();
    ipcRenderer.on("redo", subscription);
    return () => ipcRenderer.removeListener("redo", subscription);
  },
});
