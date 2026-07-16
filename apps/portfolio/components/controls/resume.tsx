"use client"
import { memo, FC } from "react"
import { FileText } from "lucide-react"
import { useDictionary } from '@/components/content/content-provider';
import ControlBadgeLink from "./control-badge-link";

interface ResumeProps {
  className?: string;
}

const Resume: FC<ResumeProps> = ({className}: ResumeProps) => {
  const $t = useDictionary();
  return (
    <ControlBadgeLink
      href={$t.links.resume}
      label={$t.controls.resume}
      Icon={FileText}
      className={className}
    />
  );
};

export default memo(Resume);
