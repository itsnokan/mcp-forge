import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Prompts are reusable, parameterized message templates the client can surface
 * to users (e.g. as slash commands). This one builds a code-review request.
 */
export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "code_review",
    {
      title: "Code review",
      description: "Generate a thorough code-review request for a snippet.",
      argsSchema: {
        code: z.string().describe("The code to review"),
        language: z.string().optional().describe("Programming language (optional)"),
      },
    },
    ({ code, language }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Please review the following${language ? ` ${language}` : ""} code for ` +
              `correctness, security, readability and performance. ` +
              `Give concrete, prioritized suggestions.\n\n` +
              "```" +
              `${language ?? ""}\n${code}\n` +
              "```",
          },
        },
      ],
    }),
  );
}
