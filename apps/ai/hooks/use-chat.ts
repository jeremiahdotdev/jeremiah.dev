"use client";

import "@/lib/globals";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  INITIAL_RESPONSE,
  REQUEST_TIMEOUT_MS,
  THINKING_FRAMES,
  TURNSTILE_RETRY_MS,
  TURNSTILE_SITE_KEY,
  TURNSTILE_TIMEOUT_MS,
} from "@/lib/constants/ui";
import type {
  ConversationInput,
  ConversationMessage,
  ConversationResponse,
} from "@/lib/types/conversation";

type PendingRequest = {
  displayMessage: string;
  history: ConversationMessage[];
  input: ConversationInput;
};

type PlaybackState = "error" | "idle" | "loading" | "paused" | "speaking";

export type TranscriptMessage = ConversationMessage & {
  animate?: boolean;
  id: string;
  speechToken?: string;
  speechText?: string;
};

type SpeechErrorResponse = {
  error: string;
  success: false;
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function useChat() {
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingRequestRef = useRef<PendingRequest | null>(null);
  const requestTimeoutRef = useRef<number | null>(null);
  const responseRef = useRef<HTMLDivElement | null>(null);
  const turnstileRetryAttemptedRef = useRef(false);
  const turnstileRetryTimeoutRef = useRef<number | null>(null);
  const turnstileTimeoutRef = useRef<number | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackAbortRef = useRef<AbortController | null>(null);
  const activeMessageIdRef = useRef<string | null>(null);
  const autoPlayNextRef = useRef(false);
  const lastAutoPlayedMessageIdRef = useRef<string | null>(null);
  const objectUrlsRef = useRef<Map<string, string>>(new Map());

  const [currentMessage, setCurrentMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(
    null,
  );
  const [playbackCached, setPlaybackCached] = useState<Record<string, boolean>>(
    {},
  );
  const [playbackStates, setPlaybackStates] = useState<Record<string, PlaybackState>>(
    {},
  );
  const [thinkingFrameIndex, setThinkingFrameIndex] = useState(0);

  const thinkingLabel = pendingRequest && !errorMessage
    ? THINKING_FRAMES[thinkingFrameIndex]
    : THINKING_FRAMES[0];
  const latestAssistantMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === "assistant") {
        return messages[index].id;
      }
    }

    return null;
  }, [messages]);

  useEffect(() => {
    if (!pendingRequest || errorMessage) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setThinkingFrameIndex(
        (current) => (current + 1) % THINKING_FRAMES.length,
      );
    }, 350);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [errorMessage, pendingRequest]);

  useEffect(() => {
    responseRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [errorMessage, messages, pendingRequest, thinkingLabel]);

  function clearRequestTimeout() {
    if (requestTimeoutRef.current !== null) {
      window.clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }

  function clearTurnstileTimeout() {
    turnstileRetryAttemptedRef.current = false;

    if (turnstileRetryTimeoutRef.current !== null) {
      window.clearTimeout(turnstileRetryTimeoutRef.current);
      turnstileRetryTimeoutRef.current = null;
    }

    if (turnstileTimeoutRef.current !== null) {
      window.clearTimeout(turnstileTimeoutRef.current);
      turnstileTimeoutRef.current = null;
    }
  }

  function updatePlaybackState(messageId: string, state: PlaybackState) {
    setPlaybackStates((current) => ({
      ...current,
      [messageId]: state,
    }));
  }

  function setPlaybackError(messageId: string, _error: string) {
    updatePlaybackState(messageId, "error");
  }

  function clearPlaybackError() {}

  function ensureAudioElement() {
    if (audioRef.current) {
      return audioRef.current;
    }

    const audio = new Audio();
    audioRef.current = audio;

    return audio;
  }

  function stopActivePlayback() {
    playbackAbortRef.current?.abort();
    playbackAbortRef.current = null;

    const activeMessageId = activeMessageIdRef.current;
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (activeMessageId) {
      updatePlaybackState(activeMessageId, "idle");
    }

    activeMessageIdRef.current = null;
  }

  async function beginPlayback(messageId: string, objectUrl: string) {
    stopActivePlayback();

    const audio = ensureAudioElement();
    activeMessageIdRef.current = messageId;
    audio.src = objectUrl;
    audio.currentTime = 0;

    audio.onended = () => {
      if (activeMessageIdRef.current === messageId) {
        updatePlaybackState(messageId, "idle");
        activeMessageIdRef.current = null;
      }
    };

    try {
      await audio.play();
      updatePlaybackState(messageId, "speaking");
    } catch {
      setPlaybackError(messageId, "Playback was blocked by the browser.");
      activeMessageIdRef.current = null;
    }
  }

  async function fetchAndPlay(message: TranscriptMessage) {
    if (!message.speechToken) {
      setPlaybackError(message.id, "This response cannot be synthesized.");
      return;
    }

    stopActivePlayback();
    clearPlaybackError();
    updatePlaybackState(message.id, "loading");

    const controller = new AbortController();
    playbackAbortRef.current = controller;

    try {
      const response = await fetch("/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: message.speechToken,
          text: message.speechText ?? message.content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json()) as SpeechErrorResponse;
        setPlaybackError(message.id, payload.error);
        return;
      }

      const audioBlob = await response.blob();
      const existingUrl = objectUrlsRef.current.get(message.id);

      if (existingUrl) {
        URL.revokeObjectURL(existingUrl);
      }

      const objectUrl = URL.createObjectURL(audioBlob);
      objectUrlsRef.current.set(message.id, objectUrl);
      setPlaybackCached((current) => ({
        ...current,
        [message.id]: true,
      }));
      await beginPlayback(message.id, objectUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        updatePlaybackState(message.id, "idle");
        return;
      }

      setPlaybackError(message.id, "Voice playback is unavailable right now.");
    } finally {
      playbackAbortRef.current = null;
    }
  }

  async function togglePlayback(
    message: TranscriptMessage,
    options?: {
      enableAutoPlayChain?: boolean;
    },
  ) {
    const currentState = playbackStates[message.id] ?? "idle";
    const cachedUrl = objectUrlsRef.current.get(message.id);
    const audio = audioRef.current;
    const shouldAutoPlayNext = options?.enableAutoPlayChain ?? false;

    if (
      activeMessageIdRef.current === message.id &&
      currentState === "speaking" &&
      audio
    ) {
      audio.pause();
      autoPlayNextRef.current = false;
      updatePlaybackState(message.id, "paused");
      return;
    }

    if (
      activeMessageIdRef.current === message.id &&
      currentState === "paused" &&
      audio
    ) {
      try {
        autoPlayNextRef.current = shouldAutoPlayNext;
        await audio.play();
        updatePlaybackState(message.id, "speaking");
      } catch {
        setPlaybackError(message.id, "Playback was blocked by the browser.");
      }
      return;
    }

    if (cachedUrl) {
      autoPlayNextRef.current = shouldAutoPlayNext;
      await beginPlayback(message.id, cachedUrl);
      return;
    }

    autoPlayNextRef.current = shouldAutoPlayNext;
    await fetchAndPlay(message);
  }

  const autoPlayLatestMessageIfNeeded = useEffectEvent(
    async function autoPlayLatestMessageIfNeeded() {
    if (!latestAssistantMessageId || !autoPlayNextRef.current) {
      return;
    }

    const latestAssistantMessage = messages.find(
      (message) => message.id === latestAssistantMessageId,
    );

    if (
      !latestAssistantMessage ||
      latestAssistantMessage.role !== "assistant" ||
      !latestAssistantMessage.speechToken ||
      lastAutoPlayedMessageIdRef.current === latestAssistantMessage.id
    ) {
      return;
    }

    lastAutoPlayedMessageIdRef.current = latestAssistantMessage.id;
    await togglePlayback(latestAssistantMessage, {
      enableAutoPlayChain: true,
    });
    },
  );

  useEffect(() => {
    void autoPlayLatestMessageIfNeeded();
  }, [latestAssistantMessageId, messages]);

  const sendChatRequest = useEffectEvent(async function sendChatRequest(
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
      const response = await fetch("/api/assistant/respond", {
        body: JSON.stringify({
          history: request.history,
          input: request.input,
          turnstileToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });
      const result = (await response.json()) as ConversationResponse;

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      const userMessage = {
        content: result.userMessage.content,
        id: createMessageId(),
        role: "user" as const,
      };
      const assistantMessage = {
        animate: true,
        content: result.message.content,
        id: createMessageId(),
        role: "assistant" as const,
        speechText: result.message.speechText,
        speechToken: result.message.speechToken,
      };

      setMessages((current) => [...current, userMessage, assistantMessage]);
      if (request.input.mode === "voice" && assistantMessage.speechToken) {
        autoPlayNextRef.current = true;
      }

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
  });

  function startTurnstileTimeout() {
    clearTurnstileTimeout();

    if (TURNSTILE_RETRY_MS > 0 && TURNSTILE_RETRY_MS < TURNSTILE_TIMEOUT_MS) {
      turnstileRetryTimeoutRef.current = window.setTimeout(() => {
        if (turnstileRetryAttemptedRef.current || !pendingRequestRef.current) {
          return;
        }

        if (!window.turnstile) {
          return;
        }

        turnstileRetryAttemptedRef.current = true;
        window.turnstile.execute(turnstileRef.current ?? undefined);
      }, TURNSTILE_RETRY_MS);
    }

    turnstileTimeoutRef.current = window.setTimeout(() => {
      setErrorMessage("Verification took too long. Please try again.");
      setIsPending(false);
      window.turnstile?.reset(turnstileRef.current ?? undefined);
    }, TURNSTILE_TIMEOUT_MS);
  }

  function queueRequest(nextRequest: PendingRequest) {
    pendingRequestRef.current = nextRequest;
    setPendingRequest(nextRequest);
    setErrorMessage("");
    setIsPending(true);
    setCurrentMessage("");

    if (!TURNSTILE_SITE_KEY) {
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

  function submitInput(input: ConversationInput) {
    if (isPending) {
      return;
    }

    const displayMessage =
      input.mode === "voice" ? "Voice message" : input.message.trim();

    if (!displayMessage) {
      return;
    }

    queueRequest({
      displayMessage,
      history: messages.map((item) => ({
        content: item.content,
        role: item.role,
      })),
      input:
        input.mode === "voice"
          ? input
          : {
              message: displayMessage,
              mode: "text",
            },
    });
  }

  function retryPendingRequest() {
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

  function getVoiceControlLabel(message: TranscriptMessage) {
    const playbackState = playbackStates[message.id] ?? "idle";

    if (playbackState === "loading") {
      return "Loading";
    }

    if (playbackState === "speaking") {
      return "Pause";
    }

    if (playbackState === "paused") {
      return "Resume";
    }

    return playbackCached[message.id] ? "Replay" : "Play";
  }

  async function handleVoiceControlClick(message: TranscriptMessage) {
    await togglePlayback(message, {
      enableAutoPlayChain: message.id === latestAssistantMessageId,
    });
  }

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

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
      playbackAbortRef.current?.abort();
      playbackAbortRef.current = null;

      const activeMessageId = activeMessageIdRef.current;
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      if (activeMessageId) {
        updatePlaybackState(activeMessageId, "idle");
      }

      activeMessageIdRef.current = null;

      for (const objectUrl of objectUrls.values()) {
        URL.revokeObjectURL(objectUrl);
      }

      objectUrls.clear();
      delete window.__onTurnstileSuccess;
      delete window.__onTurnstileExpire;
      delete window.__onTurnstileError;
    };
  }, []);

  return {
    currentMessage,
    errorMessage,
    formRef,
    getVoiceControlLabel,
    handleVoiceControlClick,
    initialResponse: INITIAL_RESPONSE,
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
  };
}
