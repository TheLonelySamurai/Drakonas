export interface IMainFunctions {
  onLoginWindow: () => void;
  createGif: (frames: any[]) => void;
  createVid: (frames: any[]) => void;
  onGifResult: (callback: (data: any) => void) => void;
  onVidResult: (callback: (data: any) => void) => void;
  saveToZip: (payload: { data: any, fileName: string }) => Promise<any>;
  saveToDatabase: (payload: any) => Promise<any>;
  updateToDatabase: (payload: any) => Promise<any>;
  loadFromLocalZip: () => Promise<any>;
  onMenuImport: (cb: () => void) => void;
  onMenuSaveLocal: (cb: () => void) => void;
  onMenuSaveDatabase: (cb: () => void) => void;
  onMenuExportGif: (cb: () => void) => void;
  onMenuExportMp4: (cb: () => void) => void;
}

declare global {
  interface Window {
    mainFunctions: IMainFunctions;
    menuNav: {
      onReturnHome: (callback: () => void) => void;
      onReturnToWorkshop: (callback: () => void) => void;
    };
    historyAPI: {
      onUndo: (callback: () => void) => () => void;
      onRedo: (callback: () => void) => () => void;
    };
  }
}
