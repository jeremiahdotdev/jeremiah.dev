export type ConversationRole = "user" | "assistant";

export type ConversationMessage = {
  role: ConversationRole;
  content: string;
};

export type ConversationAudioInput = {
  data: string;
  filename: string;
  mimeType: string;
};

export type ConversationInput =
  | {
      mode: "text";
      message: string;
    }
  | {
      audio: ConversationAudioInput;
      mode: "voice";
    };

export type ConversationRequest = {
  history?: ConversationMessage[];
  input: ConversationInput;
  turnstileToken: string;
};

export type ConversationResponse =
  | {
      success: true;
      userMessage: {
        role: "user";
        content: string;
      };
      message: {
        role: "assistant";
        content: string;
        speechText: string;
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

export type AssistantResponseContent = {
  displayText: string;
  speechText: string;
};
