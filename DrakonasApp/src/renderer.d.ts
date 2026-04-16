export interface IMainFunctions {
  onLoginWindow: () => void;
  createGif: (data: { frames: Uint8ClampedArray[], width: number, height: number }) => void;
  onGifResult: (callback: (blob: any) => void) => void;
}

declare global {
  interface Window {
    mainFunctions: IMainFunctions;
    menuNav: {
      onReturnHome: (callback: () => void) => void;
    };
    historyAPI: {
      onUndo: (callback: () => void) => () => void;
      onRedo: (callback: () => void) => () => void;
    };
  }
}
