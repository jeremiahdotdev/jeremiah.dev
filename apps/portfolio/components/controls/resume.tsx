"use client"
import { memo, FC } from "react"
import { FileText } from "lucide-react"
import { useDictionary } from '@/components/content/content-provider';
import IconLink from "../shared/icon-link";

interface ResumeProps {
  className?: string;
}

const Resume: FC<ResumeProps> = ({className}: ResumeProps) => {
  const $t = useDictionary();
  return (<IconLink Icon={FileText} tooltip={$t.controls.resume} url={$t.links.resume} className={className} />);
};

export default memo(Resume);
