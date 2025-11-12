// Type definitions for Tawk.to Chat
interface Window {
  Tawk_API?: {
    hideWidget: () => void;
    showWidget: () => void;
    maximize: () => void;
    minimize: () => void;
    toggle: () => void;
    popup: () => void;
    setAttributes: (attributes: any, callback?: (error: any) => void) => void;
    addTags: (tags: string[], callback?: (error: any) => void) => void;
    removeTags: (tags: string[], callback?: (error: any) => void) => void;
    onLoad?: () => void;
    onChatMinimized?: () => void;
    onChatMaximized?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
  };
  Tawk_LoadStart?: Date;
}


