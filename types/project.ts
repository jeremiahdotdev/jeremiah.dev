import { Icon } from "./icon";
import { Languages } from "./languages";
import { Link } from "./link";

export type ProjectTheme = {
  css?: string;
  cardSrc?: string;
  cardDarkSrc?: string;
};

export type Project = {
  name: string;
  description: string;
  summary: string;
  link: Link;
  private: boolean;
  topics?: string[];
  icon?: Icon;
  demo?: Link;
  image?: string;
  languages?: Languages;
  theme?: ProjectTheme;
};
