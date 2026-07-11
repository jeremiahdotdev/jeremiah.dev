import styles from "./style.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>Protected by Cloudflare.</p>
      <a
        className={styles.link}
        href="https://jeremiah.dev"
        rel="noreferrer"
        target="_blank"
      >
        jeremiah.dev
      </a>
    </footer>
  );
}
