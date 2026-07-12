export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatAudioInput = {
  data: string;
  filename: string;
  mimeType: string;
};

export type ChatInput =
  | {
      mode: "text";
      message: string;
    }
  | {
      audio: ChatAudioInput;
      mode: "voice";
    };

export type ChatRequest = {
  history?: ChatMessage[];
  input: ChatInput;
  turnstileToken: string;
};

export type ChatResponse =
  | {
      success: true;
      userMessage: {
        role: "user";
        content: string;
      };
      message: {
        role: "assistant";
        content: string;
        speechToken: string;
      };
    }
  | {
      success: false;
      error: string;
      code:
        | "INVALID_REQUEST"
        | "TURNSTILE_FAILED"
        | "RATE_LIMITED"
        | "OPENAI_FAILED";
    };
