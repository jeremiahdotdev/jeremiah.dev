"use client";

import Script from "next/script";
import {
  useCallback,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ConversationInput } from "@/lib/types/conversation";
import { TURNSTILE_SITE_KEY } from "@/lib/constants/ui";
import { IconButton } from "@/components/icon-button";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

type InputProps = {
  currentValue: string;
  disabled: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  onChangeValue: (value: string) => void;
  onSubmitInput: (input: ConversationInput) => void;
  turnstileRef: RefObject<HTMLDivElement | null>;
};

function TextField({
  onChange,
  value,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center">
      <input
        autoComplete="off"
        className="relative z-1 h-10 w-full min-w-0 appearance-none border-0 bg-transparent px-4 text-base leading-10 text-app-foreground outline-0 placeholder:text-app-placeholder focus-visible:outline-none"
        id="main-input"
        name="q"
        onChange={onChange}
        placeholder="Ask jeremiah.dev..."
        spellCheck={false}
        type="search"
        value={value}
      />
    </div>
  );
}

function VoicePanel({ voiceStatus }: { voiceStatus: string }) {
  return (
    <div className="flex min-h-10 min-w-0 flex-1 items-center">
      <div className="min-w-0 flex-1 truncate px-4 text-base leading-10 text-app-subtle">
        {voiceStatus}
      </div>
    </div>
  );
}

function canSubmitVoiceInput({
  hasRecordedMessage,
  isRecording,
}: {
  hasRecordedMessage: boolean;
  isRecording: boolean;
}) {
  return isRecording || hasRecordedMessage;
}

export function Input({
  currentValue,
  disabled,
  formRef,
  onChangeValue,
  onSubmitInput,
  turnstileRef,
}: InputProps) {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [isEncodingVoice, setIsEncodingVoice] = useState(false);
  const shouldSubmitRecordingRef = useRef(false);
  const voiceRecorder = useVoiceRecorder(disabled || isEncodingVoice);

  async function toBase64(blob: Blob) {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (const value of bytes) {
      binary += String.fromCharCode(value);
    }

    return window.btoa(binary);
  }

  const submitRecordedMessage = useCallback(function submitRecordedMessage(
    recordedMessage: NonNullable<typeof voiceRecorder.recordedMessage>,
  ) {
    setIsEncodingVoice(true);

    void toBase64(recordedMessage.blob)
      .then((data) => {
        onSubmitInput({
          audio: {
            data,
            filename: recordedMessage.fileName,
            mimeType: recordedMessage.mimeType,
          },
          mode: "voice",
        });
        voiceRecorder.clearRecording();
        setInputMode("text");
      })
      .finally(() => {
        setIsEncodingVoice(false);
      });
  }, [onSubmitInput, voiceRecorder]);

  useEffect(() => {
    if (
      !shouldSubmitRecordingRef.current ||
      voiceRecorder.status !== "ready" ||
      !voiceRecorder.recordedMessage
    ) {
      return;
    }

    shouldSubmitRecordingRef.current = false;
    submitRecordedMessage(voiceRecorder.recordedMessage);
  }, [
    submitRecordedMessage,
    voiceRecorder.recordedMessage,
    voiceRecorder.status,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputMode === "voice") {
      if (disabled || isEncodingVoice) {
        return;
      }

      if (voiceRecorder.status === "recording") {
        shouldSubmitRecordingRef.current = true;
        voiceRecorder.stopRecording();
        return;
      }

      const recordedMessage = voiceRecorder.recordedMessage;

      if (!recordedMessage) {
        return;
      }

      submitRecordedMessage(recordedMessage);

      return;
    }

    onSubmitInput({
      message: currentValue,
      mode: "text",
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeValue(event.currentTarget.value);
  }

  function formatDuration(durationMs: number) {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const voiceStatus = voiceRecorder.error
    ? voiceRecorder.error
    : voiceRecorder.status === "unsupported"
      ? "Voice mode is unavailable in this browser."
      : voiceRecorder.status === "recording"
        ? `Recording ${formatDuration(voiceRecorder.durationMs)}`
        : voiceRecorder.status === "ready"
          ? `Ready to send ${formatDuration(voiceRecorder.durationMs)}`
          : "Tap record to speak";
  const isRecording = voiceRecorder.status === "recording";
  const hasRecordedMessage = Boolean(voiceRecorder.recordedMessage);
  const canSubmitVoice = canSubmitVoiceInput({
    hasRecordedMessage,
    isRecording,
  });

  function handleMicClick() {
    if (disabled || isEncodingVoice || !voiceRecorder.isSupported) {
      return;
    }

    if (inputMode === "text") {
      setInputMode("voice");
      void voiceRecorder.startRecording();
      return;
    }

    if (voiceRecorder.status === "recording") {
      shouldSubmitRecordingRef.current = false;
      voiceRecorder.cancelRecording();
      setInputMode("text");
      return;
    }

    shouldSubmitRecordingRef.current = false;
    setInputMode("text");
    voiceRecorder.clearRecording();
  }

  return (
    <form
      className="app-shimmer-surface relative z-1 mb-24 flex w-full min-w-0 self-stretch rounded-full border border-transparent p-2 max-sm:mb-6 max-sm:gap-1 max-sm:rounded-3xl"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {TURNSTILE_SITE_KEY && (
        <Script
          async
          defer
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        />
      )}
      <IconButton
        active={isRecording}
        aria-label={
          inputMode === "text"
            ? "Start voice mode"
            : isRecording
              ? "Cancel recording"
              : "Exit voice mode"
        }
        disabled={disabled || isEncodingVoice || !voiceRecorder.isSupported}
        icon={isRecording ? "close" : "mic"}
        onClick={handleMicClick}
      />
      <label className="sr-only" htmlFor="main-input">
        Main input
      </label>
      {inputMode === "text" ? (
        <TextField onChange={handleChange} value={currentValue} />
      ) : (
        <VoicePanel voiceStatus={voiceStatus} />
      )}
      <IconButton
        active={inputMode === "voice" && canSubmitVoice}
        aria-label="Submit"
        disabled={
          disabled ||
          isEncodingVoice ||
          (inputMode === "voice" && !canSubmitVoice)
        }
        icon={isRecording ? "check" : "arrow"}
        type="submit"
      />
      {TURNSTILE_SITE_KEY && (
        <div
          aria-hidden="true"
          className="cf-turnstile pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
          data-appearance="execute"
          data-callback="__onTurnstileSuccess"
          data-error-callback="__onTurnstileError"
          data-execution="execute"
          data-expired-callback="__onTurnstileExpire"
          data-sitekey={TURNSTILE_SITE_KEY}
          data-theme="dark"
          ref={turnstileRef}
        />
      )}
    </form>
  );
}
