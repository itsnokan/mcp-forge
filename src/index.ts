import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { logger } from "./lib/logger.js";
import { APP_NAME, APP_VERSION } from "./lib/config.js";

/**
 * Entrypoint: connect the server to stdio. This is what an MCP client (Claude
 * Desktop, Cursor, etc.) launches.
 */
async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(`${APP_NAME} v${APP_VERSION} started on stdio`);
}

main().catch((err) => {
  logger.error("fatal error starting server", { error: (err as Error).message });
  process.exit(1);
});
