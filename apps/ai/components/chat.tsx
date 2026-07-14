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
    <div className="relative z-1 grid h-dvh w-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-4 px-0 py-4">
      <div className="mx-auto flex h-full w-full min-w-0 max-w-2xl flex-col justify-end gap-4 self-stretch px-4">
        <div
          className="grid min-h-0 w-full max-w-[42rem] content-end gap-4 overflow-y-auto px-0 pb-[4px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-sm:max-w-[32rem]"
          ref={responseRef}
        >
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
                      className="cursor-pointer rounded-full border border-app-line bg-transparent px-3 py-2 font-mono text-[12px] uppercase tracking-[2px] text-app-foreground focus-visible:border-app-line-strong focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
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
