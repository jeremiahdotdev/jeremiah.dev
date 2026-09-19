import { isValidElement, type ReactNode } from "react";
import type { CareerEvent, Job } from "@/types/job";

export type CareerMilestone = {
  id: string;
  role: Job;
  employerIndex: number;
  year: string;
  summary: string;
};

const blockElements = new Set([
  "blockquote", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "p",
]);

function getPortableText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(getPortableText).filter(Boolean).join("\n");
  }

  if (!value || typeof value !== "object") return "";

  const block = value as { text?: unknown; children?: unknown[] };
  if (typeof block.text === "string") return block.text;
  if (!Array.isArray(block.children)) return "";

  return block.children.map(getPortableText).join("");
}

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    return String(node);
  }

  if (Array.isArray(node)) return node.map(getNodeText).join("");

  if (isValidElement<{ children?: ReactNode; value?: unknown }>(node)) {
    const text = node.props.value !== undefined
      ? getPortableText(node.props.value)
      : getNodeText(node.props.children);

    return typeof node.type === "string" && blockElements.has(node.type)
      ? `${text}\n`
      : text;
  }

  return "";
}

function getSummary(description: ReactNode): string {
  const firstBlock = getNodeText(description).split("\n").find((block) => block.trim());
  const text = firstBlock?.replace(/\s+/g, " ").trim() ?? "";

  return text.match(/^.*?[.!?]["'’”]?(?=\s|$)/)?.[0] ?? text;
}

export function getCareerMilestones(
  events: CareerEvent[],
  presentLabel: string,
): CareerMilestone[] {
  const entries = events.flatMap((event, employerIndex) => (
    event.roles.map((role, roleIndex) => {
      const year = role.startDate.match(/\b\d{4}\b/)?.[0] ?? event.startYear;
      const parsedDate = Date.parse(role.startDate);
      const fallbackDate = Date.parse(`${year}-01-01`);

      return {
        id: `career-role-${employerIndex}-${roleIndex}`,
        role,
        employerIndex,
        year,
        summary: role.summary == null ? getSummary(role.description) : role.summary.trim(),
        timestamp: Number.isFinite(parsedDate)
          ? parsedDate
          : Number.isFinite(fallbackDate) ? fallbackDate : Number.NEGATIVE_INFINITY,
      };
    })
  ));

  // Keep the source order for roles that started in the same month.
  const newestFirst = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  const latestCurrentRole = newestFirst.find(({ role }) => role.endDate === presentLabel);
  return newestFirst.map(({ timestamp: _timestamp, ...entry }) => ({
    ...entry,
    year: entry.id === latestCurrentRole?.id ? presentLabel : entry.year,
  }));
}
