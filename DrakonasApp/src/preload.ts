// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer } from "electron"

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron')

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
//   // we can also expose variables, not just functions
// })
// contextBridge.exposeInMainWorld('custom',{
//     ping: () => ipcRenderer.invoke("ping")
// })
contextBridge.exposeInMainWorld("historyAPI", {
  onUndo: (callback: () => void) => ipcRenderer.on("undo", callback),
  onRedo: (callback: () => void) => ipcRenderer.on("redo", callback),
});