export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  history?: ChatMessage[];
  message: string;
  turnstileToken: string;
};

export type ChatResponse =
  | {
      success: true;
      message: {
        role: "assistant";
        content: string;
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
