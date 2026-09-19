export function getCareerDurationMonths(duration: string): number {
  if (duration.startsWith("Less than")) return 0;
  const years = Number(duration.match(/(\d+) yrs?\b/)?.[1] ?? 0);
  const months = Number(duration.match(/(\d+) mos?\b/)?.[1] ?? 0);
  return years * 12 + months;
}
