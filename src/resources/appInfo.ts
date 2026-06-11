import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { APP_NAME, APP_VERSION } from "../lib/config.js";

/**
 * Resources expose readable data to the model. Two patterns are shown:
 *  - a STATIC resource at a fixed URI (`info://app`)
 *  - a DYNAMIC resource via a URI TEMPLATE (`greeting://{name}`)
 */
export function registerResources(server: McpServer): void {
  // Static resource: fixed URI, constant-ish content.
  server.registerResource(
    "app-info",
    "info://app",
    {
      title: "App info",
      description: "Static metadata about this MCP server.",
      mimeType: "application/json",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ name: APP_NAME, version: APP_VERSION }, null, 2),
        },
      ],
    }),
  );

  // Dynamic resource: the `{name}` segment is parsed and passed to the handler.
  server.registerResource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    {
      title: "Greeting",
      description: "A personalized greeting for a given name.",
    },
    (uri, variables) => {
      const name = decodeURIComponent(String(variables.name));
      return {
        contents: [
          {
            uri: uri.href,
            text: `Hello, ${name}! Welcome to MCP Forge.`,
          },
        ],
      };
    },
  );
}
