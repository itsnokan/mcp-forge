# MCP Forge

**A production-ready TypeScript boilerplate for building [Model Context Protocol](https://modelcontextprotocol.io) servers.** Stop copy-pasting from half-finished examples — clone this, run it, and ship a real MCP server in minutes.

[![CI](https://github.com/REPLACE_ME/mcp-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/REPLACE_ME/mcp-forge/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](./tsconfig.json)

---

## Why this exists

Most MCP "starter" repos give you a single `echo` tool and leave you to figure out the rest: structured output, resources, prompts, error handling, testing, and a build that produces a real executable. MCP Forge is the opposite — a small, **strict-typed, fully tested** foundation that already demonstrates every core primitive the right way, so you can delete what you don't need and build on the rest.

## Features

- ⚡️ **Modern SDK** — built on `@modelcontextprotocol/sdk` with the `registerTool`/`registerResource`/`registerPrompt` API and Zod validation.
- 🧰 **Every primitive, done right** — example tools (incl. **structured output**), a static **resource** + a dynamic **URI-template resource**, and a **prompt**.
- 🛡️ **Correct error handling** — tools return `isError` results instead of throwing, so clients stay healthy.
- 🪵 **stdio-safe logging** — a stderr logger so you never corrupt the JSON-RPC stream on stdout (the #1 MCP footgun).
- ✅ **Real tests** — unit tests for pure logic **and** in-memory integration tests that drive a real MCP client against the server.
- 🏗️ **Ships an executable** — `tsup` bundles a single `dist/index.js` with a shebang; runs under any MCP client.
- 🤖 **AI-assistant ready** — includes a `CLAUDE.md` so Claude Code / Cursor extend the codebase correctly on the first try.
- 🔁 **CI included** — GitHub Actions runs typecheck + build + tests on every push.

## Quickstart

```bash
git clone https://github.com/REPLACE_ME/mcp-forge.git
cd mcp-forge
npm install
npm run build
npm test
```

Run it under the MCP Inspector to poke at the tools interactively:

```bash
npm run inspect
```

### Use it with Claude Desktop / Cursor

Add to your client's MCP config (adjust the path):

```json
{
  "mcpServers": {
    "mcp-forge": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-forge/dist/index.js"]
    }
  }
}
```

## Project structure

```
src/
  index.ts            # stdio entrypoint
  server.ts           # createServer() — wires every capability (start here)
  lib/
    config.ts         # name/version
    logger.ts         # stderr-only structured logger
    errors.ts         # textResult / errorResult helpers
  tools/
    echo.ts           # minimal tool (copy this for new tools)
    calculate.ts      # enum input + graceful error result
    textStats.ts      # structured output (outputSchema + structuredContent)
  resources/
    appInfo.ts        # static resource + dynamic URI-template resource
  prompts/
    codeReview.ts     # parameterized prompt
test/
  tools.test.ts       # unit tests (pure functions)
  server.test.ts      # integration tests (real client, in-memory transport)
```

## Add a tool in 30 seconds

```ts
// src/tools/myTool.ts
import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { textResult } from "../lib/errors.js";

export function registerMyTool(server: McpServer): void {
  server.registerTool(
    "my_tool",
    {
      title: "My tool",
      description: "What it does.",
      inputSchema: { name: z.string() },
    },
    ({ name }) => textResult(`Hello ${name}`),
  );
}
```

Then call `registerMyTool(server)` inside `createServer()` in `src/server.ts`. Done.

---

## 🚀 MCP Forge **Pro**

The free version gets you a clean, correct foundation. **Pro** is for shipping a *production* MCP server without the weeks of plumbing:

| | Free | **Pro** |
|---|:---:|:---:|
| Core tools / resources / prompts | ✅ | ✅ |
| Unit + integration tests, CI | ✅ | ✅ |
| **Streamable HTTP transport** | — | ✅ |
| **Authentication** (API key + OAuth bearer) | — | ✅ |
| **Deploy to Cloudflare Workers** (edge) | — | ✅ |
| **Pluggable storage** (memory / KV / SQLite) | — | ✅ |
| **OpenTelemetry** tracing & metrics | — | ✅ |
| **Rate limiting & input hardening** | — | ✅ |
| **Dockerfile + docker-compose** | — | ✅ |
| Extended example tools & architecture guide | — | ✅ |
| Priority updates | — | ✅ |

👉 **Get MCP Forge Pro:** _[link added on launch]_

---

## License

MIT — see [LICENSE](./LICENSE). Use it for anything, including commercial work.
