"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/input";
import { ResponseMessage } from "@/components/response-message";
import type { ChatMessage, ChatResponse } from "@/lib/chat/contracts";
import { trimHistory } from "@/lib/chat/validation";

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

export function Chat() {
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingRequestRef = useRef<PendingRequest | null>(null);
  const responseRef = useRef<HTMLDivElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const requestTimeoutRef = useRef<number | null>(null);
  const turnstileTimeoutRef = useRef<number | null>(null);
  const thinkingDotsIntervalRef = useRef<number | null>(null);
  const responseTypingIntervalRef = useRef<number | null>(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [thinkingDots, setThinkingDots] = useState("...");
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(
    null,
  );
  const [typingCharacterCount, setTypingCharacterCount] = useState(0);
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(
    null,
  );

  useEffect(() => {
    responseRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [errorMessage, history, isPending, pendingRequest]);

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

  function clearThinkingDotsInterval() {
    if (thinkingDotsIntervalRef.current !== null) {
      window.clearInterval(thinkingDotsIntervalRef.current);
      thinkingDotsIntervalRef.current = null;
    }
  }

  function clearResponseTypingInterval() {
    if (responseTypingIntervalRef.current !== null) {
      window.clearInterval(responseTypingIntervalRef.current);
      responseTypingIntervalRef.current = null;
    }
  }

  useEffect(() => {
    clearThinkingDotsInterval();

    if (!pendingRequest || Boolean(errorMessage)) {
      setThinkingDots("...");
      return;
    }

    setThinkingDots(".");
    thinkingDotsIntervalRef.current = window.setInterval(() => {
      setThinkingDots((previous) => {
        if (previous.length >= 3) {
          return ".";
        }

        return `${previous}.`;
      });
    }, 340);

    return () => {
      clearThinkingDotsInterval();
    };
  }, [errorMessage, pendingRequest]);

  useEffect(() => {
    clearResponseTypingInterval();

    const latestIndex = history.length - 1;
    const latestMessage = history[latestIndex];

    if (!latestMessage || latestMessage.role !== "assistant") {
      setTypingMessageIndex(null);
      setTypingCharacterCount(0);
      return;
    }

    if (!latestMessage.content.length) {
      setTypingMessageIndex(null);
      setTypingCharacterCount(0);
      return;
    }

    setTypingMessageIndex(latestIndex);
    setTypingCharacterCount(0);

    responseTypingIntervalRef.current = window.setInterval(() => {
      setTypingCharacterCount((currentCount) => {
        const nextCount = currentCount + 1;

        if (nextCount >= latestMessage.content.length) {
          clearResponseTypingInterval();
          setTypingMessageIndex(null);
          return latestMessage.content.length;
        }

        return nextCount;
      });
    }, 14);

    return () => {
      clearResponseTypingInterval();
    };
  }, [history]);

  async function sendChatRequest(request: PendingRequest, turnstileToken: string) {
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

      const nextHistory = trimHistory([
        ...request.history,
        {
          content: request.message,
          role: "user",
        },
        result.message,
      ]);

      if (result.message.role === "assistant" && result.message.content.length > 0) {
        setTypingMessageIndex(nextHistory.length - 1);
        setTypingCharacterCount(0);
      } else {
        setTypingMessageIndex(null);
        setTypingCharacterCount(0);
      }

      setHistory(nextHistory);
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
  }

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
      history,
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
      clearThinkingDotsInterval();
      clearResponseTypingInterval();
      delete window.__onTurnstileSuccess;
      delete window.__onTurnstileExpire;
      delete window.__onTurnstileError;
    };
  }, []);

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

  return (
    <div className="page-content">
      <div className="chat-transcript" ref={responseRef}>
        {history.length === 0 && !pendingRequest ? (
          <ResponseMessage label="jeremiah.dev">
            {INITIAL_RESPONSE}
          </ResponseMessage>
        ) : null}
        {history.map((message, index) => (
          <ResponseMessage
            key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
            kind={message.role}
            label={message.role === "assistant" ? "jeremiah.dev" : "you"}
          >
            {message.role === "assistant" && index === typingMessageIndex
              ? message.content.slice(0, typingCharacterCount)
              : message.content}
          </ResponseMessage>
        ))}
        {pendingRequest ? (
          <ResponseMessage kind="user" label="you">
            {pendingRequest.message}
          </ResponseMessage>
        ) : null}
        {pendingRequest ? (
          <ResponseMessage
            actions={
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
            {errorMessage || `Thinking${thinkingDots}`}
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
