"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/input";
import { ResponseMessage } from "@/components/response-message";
import type { ChatMessage, ChatResponse } from "@/lib/chat/contracts";

import { useSpeechPlayback } from "./use-speech-playback";
import { useThinkingLabel } from "./use-thinking-label";

const INITIAL_RESPONSE = "Ask anything about me. I am an open book.";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const REQUEST_TIMEOUT_MS = 30_000;
const TURNSTILE_TIMEOUT_MS = 12_000;

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

type PendingRequest = {
  history: ChatMessage[];
  message: string;
};

type TranscriptMessage = ChatMessage & {
  animate?: boolean;
  id: string;
  speechToken?: string;
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function Chat() {
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingRequestRef = useRef<PendingRequest | null>(null);
  const responseRef = useRef<HTMLDivElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const requestTimeoutRef = useRef<number | null>(null);
  const turnstileTimeoutRef = useRef<number | null>(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(
    null,
  );

  const thinkingLabel = useThinkingLabel(Boolean(pendingRequest && !errorMessage));
  const speechPlayback = useSpeechPlayback();
  const latestAssistantMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === "assistant") {
        return messages[index].id;
      }
    }

    return null;
  }, [messages]);

  useEffect(() => {
    responseRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [errorMessage, messages, pendingRequest, thinkingLabel]);

  useEffect(() => {
    if (!latestAssistantMessageId) {
      return;
    }

    const latestAssistantMessage = messages.find(
      (message) => message.id === latestAssistantMessageId,
    );

    if (
      !latestAssistantMessage ||
      latestAssistantMessage.role !== "assistant" ||
      !latestAssistantMessage.speechToken
    ) {
      return;
    }

    void speechPlayback.autoPlayMessageIfNeeded(latestAssistantMessage);
  }, [latestAssistantMessageId, messages, speechPlayback]);

  function clearRequestTimeout() {
    if (requestTimeoutRef.current !== null) {
      window.clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }

  function clearTurnstileTimeout() {
    if (turnstileTimeoutRef.current !== null) {
      window.clearTimeout(turnstileTimeoutRef.current);
      turnstileTimeoutRef.current = null;
    }
  }

  const sendChatRequest = useCallback(async function sendChatRequest(
    request: PendingRequest,
    turnstileToken: string,
  ) {
    abortRef.current?.abort();
    clearTurnstileTimeout();

    const controller = new AbortController();
    abortRef.current = controller;
    requestTimeoutRef.current = window.setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    setErrorMessage("");

    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({
          history: request.history,
          message: request.message,
          turnstileToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });
      const result = (await response.json()) as ChatResponse;

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          content: request.message,
          id: createMessageId(),
          role: "user",
        },
        {
          animate: true,
          content: result.message.content,
          id: createMessageId(),
          role: "assistant",
          speechToken: result.message.speechToken,
        },
      ]);
      setCurrentMessage("");
      setPendingRequest(null);
      pendingRequestRef.current = null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage("The assistant took too long to respond. Please retry.");
        return;
      }

      setErrorMessage("Something went wrong while contacting the assistant.");
    } finally {
      clearRequestTimeout();
      setIsPending(false);
      window.turnstile?.reset(turnstileRef.current ?? undefined);
    }
  }, []);

  function startTurnstileTimeout() {
    clearTurnstileTimeout();
    turnstileTimeoutRef.current = window.setTimeout(() => {
      setErrorMessage("Verification took too long. Please try again.");
      setIsPending(false);
      window.turnstile?.reset(turnstileRef.current ?? undefined);
    }, TURNSTILE_TIMEOUT_MS);
  }

  function queueSubmission(message: string) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isPending) {
      return;
    }

    const nextRequest = {
      history: messages.map((item) => ({
        content: item.content,
        role: item.role,
      })),
      message: trimmedMessage,
    };

    pendingRequestRef.current = nextRequest;
    setPendingRequest(nextRequest);
    setErrorMessage("");
    setIsPending(true);
    setCurrentMessage("");

    if (!turnstileSiteKey) {
      setErrorMessage("Turnstile is not configured.");
      setIsPending(false);
      return;
    }

    if (!window.turnstile) {
      setErrorMessage("Verification is still loading. Please try again.");
      setIsPending(false);
      return;
    }

    startTurnstileTimeout();
    window.turnstile.execute(turnstileRef.current ?? undefined);
  }

  useEffect(() => {
    window.__onTurnstileSuccess = (token: string) => {
      clearTurnstileTimeout();
      const request = pendingRequestRef.current;

      if (!request) {
        setErrorMessage("No request is queued for verification.");
        setIsPending(false);
        return;
      }

      void sendChatRequest(request, token);
    };

    window.__onTurnstileExpire = () => {
      clearTurnstileTimeout();
      setErrorMessage("Verification expired. Please try again.");
      setIsPending(false);
    };

    window.__onTurnstileError = () => {
      clearTurnstileTimeout();
      setErrorMessage("Verification failed to load. Please try again.");
      setIsPending(false);
    };

    return () => {
      abortRef.current?.abort();
      clearRequestTimeout();
      clearTurnstileTimeout();
      delete window.__onTurnstileSuccess;
      delete window.__onTurnstileExpire;
      delete window.__onTurnstileError;
    };
  }, [sendChatRequest]);

  function handleSubmit() {
    queueSubmission(currentMessage);
  }

  function handleRetry() {
    if (!pendingRequestRef.current || isPending) {
      return;
    }

    setErrorMessage("");
    setIsPending(true);

    if (!window.turnstile) {
      setErrorMessage("Verification is still loading. Please try again.");
      setIsPending(false);
      return;
    }

    startTurnstileTimeout();
    window.turnstile.execute(turnstileRef.current ?? undefined);
  }

  function renderAssistantVoiceControl(message: TranscriptMessage) {
    if (message.role !== "assistant" || !message.speechToken) {
      return null;
    }

    const playbackState = speechPlayback.states[message.id] ?? "idle";
    const hasCachedAudio = speechPlayback.cached[message.id];
    const buttonLabel =
      playbackState === "loading"
        ? "Loading"
        : playbackState === "speaking"
          ? "Pause"
        : playbackState === "paused"
          ? "Resume"
          : hasCachedAudio
            ? "Replay"
            : "Play";

    return (
      <button
        className="response-action"
        disabled={playbackState === "loading"}
        onClick={() => {
          void speechPlayback.togglePlayback(message, {
            enableAutoPlayChain: message.id === latestAssistantMessageId,
          });
        }}
        type="button"
      >
        {buttonLabel}
      </button>
    );
  }

  return (
    <div className="page-content">
      <div className="chat-transcript" ref={responseRef}>
        {messages.length === 0 && !pendingRequest ? (
          <ResponseMessage label="jeremiah.dev">
            {INITIAL_RESPONSE}
          </ResponseMessage>
        ) : null}

        {messages.map((message) => {
          return (
            <ResponseMessage
              animate={message.animate}
              control={renderAssistantVoiceControl(message)}
              key={message.id}
              kind={message.role}
              label={message.role === "assistant" ? "jeremiah.dev" : "you"}
            >
              {message.content}
            </ResponseMessage>
          );
        })}

        {pendingRequest ? (
          <ResponseMessage kind="user" label="you">
            {pendingRequest.message}
          </ResponseMessage>
        ) : null}

        {pendingRequest ? (
          <ResponseMessage
            control={
              errorMessage ? (
                <button
                  className="response-action"
                  onClick={handleRetry}
                  type="button"
                >
                  Retry
                </button>
              ) : null
            }
            label="jeremiah.dev"
            tone={errorMessage ? "error" : "default"}
          >
            {errorMessage || thinkingLabel}
          </ResponseMessage>
        ) : null}
      </div>

      <Input
        currentValue={currentMessage}
        disabled={isPending}
        formRef={formRef}
        onChangeValue={setCurrentMessage}
        onSubmit={handleSubmit}
        turnstileRef={turnstileRef}
      />
    </div>
  );
}
