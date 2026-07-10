"use client"
import { memo, FC } from "react"
import { Linkedin } from "lucide-react"
import { useDictionary } from '@/components/content/content-provider';
import IconLink from "../shared/icon-link";

interface LinkedInProps {
  className?: string;
}

const LinkedIn: FC<LinkedInProps> = ({className}: LinkedInProps) => {
  const $t = useDictionary();
  return (<IconLink Icon={Linkedin} tooltip={$t.controls.linkedIn} url={$t.links.linkedIn} className={className} />);
};

export default memo(LinkedIn);
