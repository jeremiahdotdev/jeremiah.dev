"use client";

import Script from "next/script";
import type { ChangeEvent, FormEvent, RefObject } from "react";

import styles from "./style.module.css";

type InputProps = {
  currentValue: string;
  disabled: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  turnstileRef: RefObject<HTMLDivElement | null>;
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function Input({
  currentValue,
  disabled,
  formRef,
  onChangeValue,
  onSubmit,
  turnstileRef,
}: InputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeValue(event.currentTarget.value);
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
      <label className={styles.srOnly} htmlFor="main-input">
        Main input
      </label>
      <input
        autoComplete="off"
        className={styles.input}
        id="main-input"
        name="q"
        onChange={handleChange}
        placeholder="Ask..."
        spellCheck={false}
        type="search"
        value={currentValue}
      />
      <button
        aria-label="Submit"
        className={styles.button}
        disabled={disabled}
        type="submit"
      >
        {"\u2191"}
      </button>
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
