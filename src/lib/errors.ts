import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Helpers for building tool results consistently.
 *
 * MCP tools should return errors as a *result* with `isError: true` (so the
 * model can see and react to them), not by throwing — throwing surfaces as a
 * protocol error and is harder for the client to handle gracefully.
 */

export function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

export function errorResult(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}

/** Throw this inside tool logic; handlers convert it into an error result. */
export class ToolError extends Error {
  public override readonly name = "ToolError";
}
