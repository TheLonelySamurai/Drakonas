import { shell, app, Menu, BrowserWindow } from 'electron';

const isMac = process.platform === 'darwin'
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' } 
  {
    label: 'Drakonas',
    submenu: [
        {
            label: 'Projects',
            click:  () =>{    
              BrowserWindow.getFocusedWindow()?.webContents.send('projects');
            }   
        },
        {
            label: 'Import',
            click: async () =>{
                const win = BrowserWindow.getFocusedWindow();
                if (!win) return;
                await win.webContents.executeJavaScript(`localStorage.setItem('pending_menu_action', 'import')`);
                win.webContents.send('workshop');
            }
        },
        {
            label: 'Save',
            // click: async () =>{
            //     console.log("Save Clicked!")
            // }
            submenu:[
              {
                label: 'Save to Local',
                click: async () =>{
                    const win = BrowserWindow.getFocusedWindow();
                    if (!win) return;
                    await win.webContents.executeJavaScript(`localStorage.setItem('pending_menu_action', 'save-local')`);
                    win.webContents.send('workshop');
                }
              },
              {
                label: 'Save to Database',
                click: async () =>{
                    const win = BrowserWindow.getFocusedWindow();
                    if (!win) return;
                    await win.webContents.executeJavaScript(`localStorage.setItem('pending_menu_action', 'save-database')`);
                    win.webContents.send('workshop');
                }
              }
            ]

        },
        {
            label: 'Export',
            // click: async () =>{
            //     console.log("Export Clicked!")
              
            // }
            submenu:[
              {
                label: "Export as GIF",
                click: async () =>{
                  BrowserWindow.getFocusedWindow()?.webContents.send('export-gif');
                }
              },
              {
                label: "Export as MP4",
                click: async () =>{
                  BrowserWindow.getFocusedWindow()?.webContents.send('export-mp4');
                }
              }
            ]
        },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => {
          BrowserWindow.getFocusedWindow()?.webContents.send('undo');
        }
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => {
          BrowserWindow.getFocusedWindow()?.webContents.send('redo');
        }
      },
      //No time
    //   { type: 'separator' },
    //   { role: 'cut' },
    //   { role: 'copy' },
    //   { role: 'paste' },
    //   ...(isMac
    //     ? [
    //         { role: 'pasteAndMatchStyle' },
    //         { role: 'delete' },
    //         { role: 'selectAll' },
    //         { type: 'separator' },
    //         {
    //           label: 'Speech',
    //           submenu: [
    //             { role: 'startSpeaking' },
    //             { role: 'stopSpeaking' }
    //           ]
    //         }
    //       ]
    //     : [
    //         { role: 'delete' },
    //         { type: 'separator' },
    //         { role: 'selectAll' }
    //       ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      // { type: 'separator' },
      // { role: 'resetZoom' },
      // { role: 'zoomIn' },
      // { role: 'zoomOut' },
      // { type: 'separator' },
      // { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Open Repository',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/TheLonelySamurai/Drakonas')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template as any)
export default menu