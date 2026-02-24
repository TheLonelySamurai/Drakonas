interface Window {
  historyAPI: {
    onUndo(cb: () => void): void;
    onRedo(cb: () => void): void;
  };
}
