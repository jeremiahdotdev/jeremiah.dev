import { Code2 } from "lucide-react";
import Image from "next/image";
import type { ComponentType } from "react";
import {
  Docker,
  DotNetCore,
  DynamoDB,
  Geogabra,
  GoLang,
  GoogleCloudPlatform,
  GoogleTagManager,
  HTML5,
  JavaScript,
  JQuery,
  LaTeX,
  MatLab,
  Mathematica,
  NodeJS,
  PSPP,
  React as ReactLogo,
  Telerik,
  Thymeleaf,
  TypeScript,
  Vue,
} from "@/components/utility/SVGs";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

const logos: Record<string, ComponentType> = {
  javascript: JavaScript,
  js: JavaScript,
  html: HTML5,
  html5: HTML5,
  jquery: JQuery,
  vue: Vue,
  vuejs: Vue,
  gtm: GoogleTagManager,
  googletagmanager: GoogleTagManager,
  dynamodb: DynamoDB,
  amazondynamodb: DynamoDB,
  react: ReactLogo,
  reactjs: ReactLogo,
  reactnative: ReactLogo,
  typescript: TypeScript,
  ts: TypeScript,
  kendo: Telerik,
  kendoui: Telerik,
  telerik: Telerik,
  net: DotNetCore,
  netcore: DotNetCore,
  dotnet: DotNetCore,
  dotnetcore: DotNetCore,
  latex: LaTeX,
  mathematica: Mathematica,
  wolframmathematica: Mathematica,
  pspp: PSPP,
  matlab: MatLab,
  geogabra: Geogabra,
  geogebra: Geogabra,
  go: GoLang,
  golang: GoLang,
  thymeleaf: Thymeleaf,
  docker: Docker,
  gcp: GoogleCloudPlatform,
  googlecloud: GoogleCloudPlatform,
  googlecloudplatform: GoogleCloudPlatform,
  node: NodeJS,
  nodejs: NodeJS,
};

const svgLogos: Record<string, string> = {
  jenkins: "/skill-icons/jenkins.svg",
  expo: "/skill-icons/expo.svg",
  nextjs: "/skill-icons/nextjs.svg",
};

export default function SkillLogo({ skill }: { skill: Skill }) {
  const name = skill.subtitle.toLowerCase().replace(/[^a-z0-9]/g, "");
  const Logo = logos[name] ?? Code2;
  const svgLogo = svgLogos[name];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-full w-full items-center justify-center text-foreground [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full",
        !skill.image && (name === "latex" || name === "pspp") && "dark:invert",
      )}
    >
      {skill.image ?? (svgLogo ? (
        <Image src={svgLogo} alt="" width={48} height={48} unoptimized className={cn((name === "expo" || name === "nextjs") && "dark:invert")} />
      ) : <Logo />)}
    </span>
  );
}
