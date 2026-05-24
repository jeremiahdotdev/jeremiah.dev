import {
  AssociationForComputingMachinery,
  Docker,
  DotNetCore,
  DynamoDB,
  EducationalTestingService,
  Geogabra,
  GoLang,
  GoogleCloudPlatform,
  GoogleTagManager,
  HTML5,
  JavaScript,
  JQuery,
  LaTeX,
  MatLab,
  MathAndPhysicsClub,
  Mathematica,
  NodeJS,
  PSPP,
  React,
  SigmaZeta,
  Telerik,
  Thymeleaf,
  TypeScript,
  Vue,
} from '@/components/utility/SVGs'

export const skillIconMap = {
  javascript: JavaScript,
  html5: HTML5,
  jquery: JQuery,
  vue: Vue,
  vuejs: Vue,
  googleTagManager: GoogleTagManager,
  gtm: GoogleTagManager,
  dynamodb: DynamoDB,
  react: React,
  reactjs: React,
  typescript: TypeScript,
  telerik: Telerik,
  dotnetcore: DotNetCore,
  latex: LaTeX,
  mathematica: Mathematica,
  pspp: PSPP,
  matlab: MatLab,
  geogabra: Geogabra,
  golang: GoLang,
  thymeleaf: Thymeleaf,
  docker: Docker,
  googleCloudPlatform: GoogleCloudPlatform,
  gcp: GoogleCloudPlatform,
  nodejs: NodeJS,
} as const

export const commendationIconMap = {
  mathAndPhysicsClub: MathAndPhysicsClub,
  sigmaZeta: SigmaZeta,
  educationalTestingService: EducationalTestingService,
  majorFieldExam: EducationalTestingService,
  associationForComputingMachinery: AssociationForComputingMachinery,
  acm: AssociationForComputingMachinery,
} as const

export function getSkillIcon(iconKey?: string) {
  const Icon = iconKey ? skillIconMap[iconKey as keyof typeof skillIconMap] : undefined
  return Icon ? Icon() : undefined
}

export function getCommendationIcon(iconKey?: string) {
  const Icon = iconKey ? commendationIconMap[iconKey as keyof typeof commendationIconMap] : undefined
  return Icon ? Icon() : undefined
}
