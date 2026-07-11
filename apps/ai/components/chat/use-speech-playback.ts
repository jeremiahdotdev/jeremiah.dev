"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechPlaybackState = "error" | "idle" | "loading" | "paused" | "speaking";

type PlayableAssistantMessage = {
  content: string;
  id: string;
  speechToken?: string;
};

type SpeechErrorResponse = {
  error: string;
  success: false;
};

export function useSpeechPlayback() {
  const abortRef = useRef<AbortController | null>(null);
  const activeMessageIdRef = useRef<string | null>(null);
  const autoPlayNextRef = useRef(false);
  const lastAutoPlayedMessageIdRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlsRef = useRef<Map<string, string>>(new Map());

  const [cached, setCached] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [states, setStates] = useState<Record<string, SpeechPlaybackState>>({});

  function updateState(messageId: string, state: SpeechPlaybackState) {
    setStates((current) => ({
      ...current,
      [messageId]: state,
    }));
  }

  function setError(messageId: string, error: string) {
    setErrors((current) => ({
      ...current,
      [messageId]: error,
    }));
    updateState(messageId, "error");
  }

  function clearError(messageId: string) {
    setErrors((current) => {
      if (!current[messageId]) {
        return current;
      }

      const next = { ...current };
      delete next[messageId];
      return next;
    });
  }

  function ensureAudioElement() {
    if (audioRef.current) {
      return audioRef.current;
    }

    const audio = new Audio();
    audioRef.current = audio;

    return audio;
  }

  const stopActivePlayback = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    const activeMessageId = activeMessageIdRef.current;
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (activeMessageId) {
      updateState(activeMessageId, "idle");
    }

    activeMessageIdRef.current = null;
  }, []);

  async function beginPlayback(messageId: string, objectUrl: string) {
    stopActivePlayback();

    const audio = ensureAudioElement();
    activeMessageIdRef.current = messageId;
    audio.src = objectUrl;
    audio.currentTime = 0;

    audio.onended = () => {
      if (activeMessageIdRef.current === messageId) {
        updateState(messageId, "idle");
        activeMessageIdRef.current = null;
      }
    };

    try {
      await audio.play();
      updateState(messageId, "speaking");
    } catch {
      setError(messageId, "Playback was blocked by the browser.");
      activeMessageIdRef.current = null;
    }
  }

  async function fetchAndPlay(message: PlayableAssistantMessage) {
    if (!message.speechToken) {
      setError(message.id, "This response cannot be synthesized.");
      return;
    }

    stopActivePlayback();
    clearError(message.id);
    updateState(message.id, "loading");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: message.speechToken,
          text: message.content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json()) as SpeechErrorResponse;
        setError(message.id, payload.error);
        return;
      }

      const audioBlob = await response.blob();
      const existingUrl = objectUrlsRef.current.get(message.id);

      if (existingUrl) {
        URL.revokeObjectURL(existingUrl);
      }

      const objectUrl = URL.createObjectURL(audioBlob);
      objectUrlsRef.current.set(message.id, objectUrl);
      setCached((current) => ({
        ...current,
        [message.id]: true,
      }));
      await beginPlayback(message.id, objectUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        updateState(message.id, "idle");
        return;
      }

      setError(message.id, "Voice playback is unavailable right now.");
    } finally {
      abortRef.current = null;
    }
  }

  async function togglePlayback(
    message: PlayableAssistantMessage,
    options?: {
      enableAutoPlayChain?: boolean;
    },
  ) {
    const currentState = states[message.id] ?? "idle";
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
      updateState(message.id, "paused");
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
        updateState(message.id, "speaking");
      } catch {
        setError(message.id, "Playback was blocked by the browser.");
      }
      return;
    }

    if (cachedUrl) {
      clearError(message.id);
      autoPlayNextRef.current = shouldAutoPlayNext;
      await beginPlayback(message.id, cachedUrl);
      return;
    }

    autoPlayNextRef.current = shouldAutoPlayNext;
    await fetchAndPlay(message);
  }

  function stopPlayback(messageId: string) {
    autoPlayNextRef.current = false;

    if (activeMessageIdRef.current !== messageId) {
      updateState(messageId, "idle");
      return;
    }

    stopActivePlayback();
  }

  async function autoPlayMessageIfNeeded(message: PlayableAssistantMessage) {
    if (
      !autoPlayNextRef.current ||
      lastAutoPlayedMessageIdRef.current === message.id
    ) {
      return;
    }

    lastAutoPlayedMessageIdRef.current = message.id;
    await togglePlayback(message, {
      enableAutoPlayChain: true,
    });
  }

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => {
      stopActivePlayback();

      for (const objectUrl of objectUrls.values()) {
        URL.revokeObjectURL(objectUrl);
      }

      objectUrls.clear();
    };
  }, [stopActivePlayback]);

  return {
    autoPlayMessageIfNeeded,
    cached,
    errors,
    states,
    stopPlayback,
    togglePlayback,
  };
}
