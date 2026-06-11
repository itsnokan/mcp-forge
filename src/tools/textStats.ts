import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Demonstrates STRUCTURED OUTPUT: when a tool declares an `outputSchema`, it
 * must return `structuredContent` matching that schema (plus a human-readable
 * `content` block). Clients that understand structured output can consume the
 * typed object directly.
 */
export interface TextStats {
  characters: number;
  words: number;
  lines: number;
  sentences: number;
  // Index signature lets this satisfy the SDK's structuredContent shape
  // (Record<string, unknown>) while keeping all fields numeric.
  [key: string]: number;
}

export function textStats(text: string): TextStats {
  const words = (text.match(/\b[\w']+\b/g) ?? []).length;
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  const sentences = (text.match(/[.!?]+(?=\s|$)/g) ?? []).length;
  return { characters: text.length, words, lines, sentences };
}

export function registerTextStats(server: McpServer): void {
  server.registerTool(
    "text_stats",
    {
      title: "Text statistics",
      description: "Count characters, words, lines and sentences in a block of text.",
      inputSchema: {
        text: z.string().describe("Text to analyze"),
      },
      outputSchema: {
        characters: z.number(),
        words: z.number(),
        lines: z.number(),
        sentences: z.number(),
      },
    },
    ({ text }) => {
      const stats = textStats(text);
      return {
        content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
        structuredContent: stats,
      };
    },
  );
}
