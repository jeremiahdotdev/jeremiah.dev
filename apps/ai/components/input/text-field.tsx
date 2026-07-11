import type { ChangeEvent } from "react";

import styles from "./style.module.css";

type TextFieldProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export function TextField({ onChange, value }: TextFieldProps) {
  return (
    <input
      autoComplete="off"
      className={styles.input}
      id="main-input"
      name="q"
      onChange={onChange}
      placeholder="Ask jeremiah.dev..."
      spellCheck={false}
      type="search"
      value={value}
    />
  );
}
