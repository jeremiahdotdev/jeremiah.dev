"use client";

import { useEffect, useRef, useState } from "react";

type RecorderStatus = "idle" | "ready" | "recording" | "unsupported";

export type RecordedVoiceMessage = {
  blob: Blob;
  durationMs: number;
  fileName: string;
  mimeType: string;
};

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
] as const;

function getSupportedMimeType() {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return null;
  }

  return (
    MIME_CANDIDATES.find((value) => MediaRecorder.isTypeSupported(value)) ?? null
  );
}

function createFileName(mimeType: string) {
  if (mimeType.includes("mp4")) {
    return "voice-message.mp4";
  }

  if (mimeType.includes("ogg")) {
    return "voice-message.ogg";
  }

  return "voice-message.webm";
}

export function useVoiceRecorder(disabled: boolean) {
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [recordingDurationMs, setRecordingDurationMs] = useState(0);
  const [recordedMessage, setRecordedMessage] =
    useState<RecordedVoiceMessage | null>(null);
  const [status, setStatus] = useState<RecorderStatus>("idle");

  const durationMs =
    status === "recording"
      ? recordingDurationMs
      : recordedMessage?.durationMs ?? 0;

  useEffect(() => {
    if (status !== "recording") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRecordingDurationMs(
        startedAtRef.current ? Date.now() - startedAtRef.current : 0,
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (!disabled || status !== "recording") {
      return;
    }

    mediaRecorderRef.current?.stop();
  }, [disabled, status]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();

      for (const track of mediaStreamRef.current?.getTracks() ?? []) {
        track.stop();
      }
    };
  }, []);

  async function startRecording() {
    const supportedMimeType = getSupportedMimeType();

    if (!supportedMimeType) {
      setIsSupported(false);
      setStatus("unsupported");
      return;
    }

    if (!isSupported || disabled) {
      return;
    }

    setError("");
    setRecordedMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
      });

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      setRecordingDurationMs(0);
      setStatus("recording");

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setStatus("idle");
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || supportedMimeType;
        const duration = startedAtRef.current
          ? Date.now() - startedAtRef.current
          : 0;

        for (const track of stream.getTracks()) {
          track.stop();
        }

        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        startedAtRef.current = null;
        setRecordingDurationMs(0);

        if (chunksRef.current.length === 0) {
          setStatus("idle");
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: mimeType,
        });

        chunksRef.current = [];
        setRecordedMessage({
          blob,
          durationMs: duration,
          fileName: createFileName(mimeType),
          mimeType,
        });
        setStatus("ready");
      };

      recorder.start();
    } catch {
      setError("Microphone access was blocked.");
      setStatus("idle");
    }
  }

  function stopRecording() {
    if (status !== "recording") {
      return;
    }

    mediaRecorderRef.current?.stop();
  }

  function clearRecording() {
    setError("");
    setRecordingDurationMs(0);
    setRecordedMessage(null);
    setStatus(isSupported ? "idle" : "unsupported");
  }

  return {
    clearRecording,
    durationMs,
    error,
    isSupported,
    recordedMessage,
    startRecording,
    status,
    stopRecording,
  };
}
