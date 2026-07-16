"use client";

import { memo, type FC } from "react";
import { MessageCircle } from "lucide-react";

import { useDictionary } from "@/components/content/content-provider";
import ControlBadgeLink from "./control-badge-link";

interface AskAiFloatProps {
  className?: string;
}

const AskAiFloat: FC<AskAiFloatProps> = ({ className }) => {
  const $t = useDictionary();

  return (
    <ControlBadgeLink
      href={$t.links.ai}
      label={$t.controls.askAi}
      expandedLabel={$t.controls.askAiPrompt}
      Icon={MessageCircle}
      className={className}
    />
  );
};

export default memo(AskAiFloat);
