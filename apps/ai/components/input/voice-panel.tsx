import styles from "./style.module.css";

type VoicePanelProps = {
  voiceStatus: string;
};

export function VoicePanel({ voiceStatus }: VoicePanelProps) {
  return (
    <div className={styles.voicePanel}>
      <div className={styles.voiceStatus}>{voiceStatus}</div>
    </div>
  );
}
