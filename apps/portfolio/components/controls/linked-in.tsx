"use client"
import { memo, FC } from "react"
import { Linkedin } from "lucide-react"
import { useDictionary } from '@/components/content/content-provider';
import ControlBadgeLink from "./control-badge-link";

interface LinkedInProps {
  className?: string;
}

const LinkedIn: FC<LinkedInProps> = ({className}: LinkedInProps) => {
  const $t = useDictionary();
  return (
    <ControlBadgeLink
      href={$t.links.linkedIn}
      label={$t.controls.linkedIn}
      Icon={Linkedin}
      className={className}
    />
  );
};

export default memo(LinkedIn);
