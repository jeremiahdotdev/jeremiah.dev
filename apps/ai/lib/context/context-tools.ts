import type { FunctionTool } from "openai/resources/responses/responses";

import {
  getApprovedProfileContext,
  getApprovedProfileDocuments,
  getApprovedProfileTopics,
  type ApprovedProfileTopic,
} from "./profile";

type ApprovedProfileContextSelection = {
  category: ApprovedProfileTopic;
};

const approvedProfileDocuments = getApprovedProfileDocuments();
const approvedProfileTopics = getApprovedProfileTopics();

function getTopicDescription(topic: ApprovedProfileTopic) {
  const document = approvedProfileDocuments[topic];

  if (document.description?.trim()) {
    return document.description.trim();
  }

  const firstPoint = document.sections.flatMap((section) => section.points)[0];

  if (firstPoint) {
    return firstPoint;
  }

  return `Approved context about Jeremiah's ${topic}.`;
}

function isApprovedProfileTopic(value: string): value is ApprovedProfileTopic {
  return approvedProfileTopics.includes(value as ApprovedProfileTopic);
}

export const approvedProfileContextTool: FunctionTool = {
  description:
    "Load approved profile context for one Jeremiah category needed to answer the user accurately.",
  name: "get_approved_profile_context",
  parameters: {
    additionalProperties: false,
    properties: {
      category: {
        description: "The single approved profile category to load.",
        enum: approvedProfileTopics,
        type: "string",
      },
    },
    required: ["category"],
    type: "object",
  },
  strict: true,
  type: "function",
};

export function parseApprovedProfileContextSelection(
  value: string,
): ApprovedProfileContextSelection {
  const parsed = JSON.parse(value) as {
    category?: unknown;
  };

  if (typeof parsed.category !== "string" || !isApprovedProfileTopic(parsed.category)) {
    throw new Error("Context tool call must include a valid category.");
  }

  return {
    category: parsed.category,
  };
}

export function executeApprovedProfileContextSelection(
  selection: ApprovedProfileContextSelection,
) {
  return {
    context: getApprovedProfileContext([selection.category]),
    topic: {
      description: getTopicDescription(selection.category),
      sections: approvedProfileDocuments[selection.category].sections,
      topic: selection.category,
    },
  };
}
