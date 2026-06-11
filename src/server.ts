import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { APP_NAME, APP_VERSION } from "./lib/config.js";
import { registerEcho } from "./tools/echo.js";
import { registerCalculate } from "./tools/calculate.js";
import { registerTextStats } from "./tools/textStats.js";
import { registerResources } from "./resources/appInfo.js";
import { registerPrompts } from "./prompts/codeReview.js";

/**
 * Builds a fully-wired MCP server. Kept transport-agnostic on purpose: the
 * stdio entrypoint (`index.ts`) and the test suite both call this factory, so
 * what you test is exactly what ships.
 *
 * To add a capability: create a `register*` function in tools/resources/prompts
 * and call it here.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: APP_NAME, version: APP_VERSION });

  registerEcho(server);
  registerCalculate(server);
  registerTextStats(server);
  registerResources(server);
  registerPrompts(server);

  return server;
}
