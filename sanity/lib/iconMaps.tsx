import {
  AssociationForComputingMachinery,
  EducationalTestingService,
  MathAndPhysicsClub,
  SigmaZeta,
} from '@/components/utility/SVGs'

export const commendationIconMap = {
  mathAndPhysicsClub: MathAndPhysicsClub,
  sigmaZeta: SigmaZeta,
  educationalTestingService: EducationalTestingService,
  majorFieldExam: EducationalTestingService,
  associationForComputingMachinery: AssociationForComputingMachinery,
  acm: AssociationForComputingMachinery,
} as const

export function getCommendationIcon(iconKey?: string) {
  const Icon = iconKey ? commendationIconMap[iconKey as keyof typeof commendationIconMap] : undefined
  return Icon ? Icon() : undefined
}
