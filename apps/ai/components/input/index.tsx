"use client";

import Script from "next/script";
import {
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  useState,
} from "react";

import type { ChatAudioInput } from "@/lib/chat/contracts";

import styles from "./style.module.css";
import { TextField } from "./text-field";
import { useVoiceRecorder } from "./use-voice-recorder";
import { VoicePanel } from "./voice-panel";
import { CircleIconButton } from "../circle-icon-button";
import { MicIcon } from "./icons";

type InputProps = {
  currentValue: string;
  disabled: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  onChangeValue: (value: string) => void;
  onSubmitText: () => void;
  onSubmitVoice: (audio: ChatAudioInput) => void;
  turnstileRef: RefObject<HTMLDivElement | null>;
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function Input({
  currentValue,
  disabled,
  formRef,
  onChangeValue,
  onSubmitText,
  onSubmitVoice,
  turnstileRef,
}: InputProps) {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [isEncodingVoice, setIsEncodingVoice] = useState(false);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputMode === "voice") {
      const recordedMessage = voiceRecorder.recordedMessage;

      if (!recordedMessage || disabled || isEncodingVoice) {
        return;
      }

      setIsEncodingVoice(true);

      void toBase64(recordedMessage.blob)
        .then((data) => {
          onSubmitVoice({
            data,
            filename: recordedMessage.fileName,
            mimeType: recordedMessage.mimeType,
          });
          voiceRecorder.clearRecording();
        })
        .finally(() => {
          setIsEncodingVoice(false);
        });

      return;
    }

    onSubmitText();
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
      voiceRecorder.stopRecording();
      return;
    }

    setInputMode("text");
    voiceRecorder.clearRecording();
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit} ref={formRef}>
      {siteKey ? (
          <Script
            async
            defer
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          />
      ) : null}
      <CircleIconButton 
        active={Boolean(inputMode === "voice")}
        aria-label={
          inputMode === "text"
            ? "Start voice mode"
            : voiceRecorder.status === "recording"
              ? "Stop recording"
              : "Exit voice mode"
        }
        disabled={disabled || isEncodingVoice || !voiceRecorder.isSupported} 
        onClick={handleMicClick}
      >
        <MicIcon />
      </CircleIconButton>
      <label className={styles.srOnly} htmlFor="main-input">
        Main input
      </label>
      {inputMode === "text" ? (
        <TextField onChange={handleChange} value={currentValue} />
      ) : (
        <VoicePanel voiceStatus={voiceStatus} />
      )}
      <CircleIconButton
        active={Boolean(inputMode === "voice" && voiceRecorder.recordedMessage)}
        aria-label="Submit"
        disabled={
          disabled ||
          isEncodingVoice ||
          (inputMode === "voice" && !voiceRecorder.recordedMessage)
        }
        type="submit"
      >
        {"\u2191"}
      </CircleIconButton>
      {siteKey ? (
          <div
            className={`cf-turnstile ${styles.turnstile}`}
            data-appearance="execute"
            data-callback="__onTurnstileSuccess"
            data-error-callback="__onTurnstileError"
            data-execution="execute"
            data-expired-callback="__onTurnstileExpire"
            data-sitekey={siteKey}
            data-theme="dark"
            ref={turnstileRef}
          />
      ) : null}
    </form>
  );
}
