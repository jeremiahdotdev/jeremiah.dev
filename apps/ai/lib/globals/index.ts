declare global {
  interface Window {
    __onTurnstileError?: () => void;
    __onTurnstileExpire?: () => void;
    __onTurnstileSuccess?: (token: string) => void;
    turnstile?: {
      execute: (container?: string | HTMLElement) => void;
      reset: (container?: string | HTMLElement) => void;
    };
  }
}

export {};
