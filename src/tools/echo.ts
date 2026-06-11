import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { textResult } from "../lib/errors.js";

/**
 * The minimal "hello world" tool. Copy this file as the starting point for new
 * tools: define an input schema with Zod, then return a result.
 */
export function registerEcho(server: McpServer): void {
  server.registerTool(
    "echo",
    {
      title: "Echo",
      description: "Return the same message back. The minimal example tool.",
      inputSchema: {
        message: z.string().describe("Message to echo back"),
      },
    },
    ({ message }) => textResult(message),
  );
}
