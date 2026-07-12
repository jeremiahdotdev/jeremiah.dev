"use client";

import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/chat-input";
import { ResponseMessage } from "@/components/response-message";
import { useChat } from "@/hooks/use-chat";

export function Chat() {
  const {
    currentMessage,
    errorMessage,
    formRef,
    getVoiceControlLabel,
    handleVoiceControlClick,
    initialResponse,
    isPending,
    messages,
    pendingRequest,
    playbackStates,
    responseRef,
    retryPendingRequest,
    setCurrentMessage,
    submitInput,
    thinkingLabel,
    turnstileRef,
  } = useChat();

  return (
    <div className="page-content">
      <div className="mx-auto flex h-full w-full min-w-0 max-w-2xl flex-col justify-end gap-4 self-stretch px-4">
        <div className="chat-transcript" ref={responseRef}>
          {messages.length === 0 && !pendingRequest && (
            <ResponseMessage label="jeremiah.dev">
              {initialResponse}
            </ResponseMessage>
          )}

        {messages.map((message) => {
          const playbackState = playbackStates[message.id] ?? "idle";
          const control = message.role === "assistant" && message.speechToken && (
            <IconButton
              active={playbackState === "speaking"}
              aria-label={getVoiceControlLabel(message)}
              disabled={playbackState === "loading"}
              icon={playbackState === "speaking" ? "pause" : "speaker"}
              onClick={() => {
                void handleVoiceControlClick(message);
              }}
                size="compact"
              />
            );

            return (
              <ResponseMessage
                animate={message.animate}
                control={control}
                key={message.id}
                kind={message.role}
                label={message.role === "assistant" ? "jeremiah.dev" : "you"}
              >
                {message.content}
              </ResponseMessage>
            );
          })}

          {pendingRequest && (
            <>
              <ResponseMessage kind="user" label="you">
                {pendingRequest.displayMessage}
              </ResponseMessage>
              <ResponseMessage
                control={
                  errorMessage && (
                    <button
                      className="response-action"
                      onClick={retryPendingRequest}
                      type="button"
                    >
                      Retry
                    </button>
                  )
                }
                label="jeremiah.dev"
                tone={errorMessage ? "error" : "default"}
              >
                {errorMessage || thinkingLabel}
              </ResponseMessage>
            </>
          )}
        </div>

        <Input
          currentValue={currentMessage}
          disabled={isPending}
          formRef={formRef}
          onChangeValue={setCurrentMessage}
          onSubmitInput={submitInput}
          turnstileRef={turnstileRef}
        />
      </div>
    </div>
  );
}
