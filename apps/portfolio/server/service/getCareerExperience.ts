import type { CareerEvent } from "@/types/job";
import { getCareerDurationMonths } from "@/lib/career-duration";

export function getCareerExperience(events: Pick<CareerEvent, "duration">[]) {
  // Preserve whole months until the final display rounding.
  const totalMonths = events.reduce((total, { duration }) => (
    total + getCareerDurationMonths(duration)
  ), 0);
  return Math.round(totalMonths * 10 / 12) / 10;
}
