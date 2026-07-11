import { CircleIconButton } from "@/components/circle-icon-button";

import { SpeakerIcon } from "./icons";

type AssistantVoiceControlProps = {
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function AssistantVoiceControl({
  disabled,
  label,
  onClick,
}: AssistantVoiceControlProps) {
  return (
    <CircleIconButton
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      size="compact"
    >
      <SpeakerIcon />
    </CircleIconButton>
  );
}
