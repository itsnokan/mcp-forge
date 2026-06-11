<!-- GRAPHIFY START -->
⚠️ **ATENÇÃO CLAUDE:** Ocorreu um erro crítico durante a última tentativa de rodar o `graphify`.
Por favor, lê o erro abaixo e ajuda o utilizador a corrigi-lo.

### Erro Reportado:
```text

```
<!-- GRAPHIFY END -->

# MCP Forge — guidance for AI coding assistants

This file tells Claude Code, Cursor, and similar tools how to extend this codebase correctly. Follow it exactly.

## What this project is

A TypeScript boilerplate for **Model Context Protocol (MCP) servers**, built on `@modelcontextprotocol/sdk`. ESM-only, strict TypeScript, bundled with `tsup`, tested with `vitest`.

## Golden rules

1. **Never write to stdout.** stdio MCP servers use stdout for JSON-RPC. Use the `logger` from `src/lib/logger.ts` (it writes to stderr). No `console.log`.
2. **Tools fail with results, not throws.** Return `errorResult(msg)` (`src/lib/errors.ts`) with `isError: true`. Reserve `throw` for pure helper functions, and catch it in the handler.
3. **Keep logic pure and testable.** Put the real work in an exported pure function; the `register*` function only wires Zod schemas and formats results. Unit-test the pure function.
4. **Validate every input with Zod.** Describe each field with `.describe(...)` — clients show these to users/models.
5. **Register in one place.** Every capability is wired in `createServer()` in `src/server.ts`. Add new `register*` calls there.

## How to add a capability

- **Tool:** new file in `src/tools/`, export `registerX(server)`, mirror `src/tools/calculate.ts`. For typed results add an `outputSchema` and return `structuredContent` (see `src/tools/textStats.ts`).
- **Resource:** add to `src/resources/`, mirror `src/resources/appInfo.ts` (static URI or `ResourceTemplate`).
- **Prompt:** add to `src/prompts/`, mirror `src/prompts/codeReview.ts`.

## Conventions

- Imports use `.js` extensions on relative paths (ESM + `moduleResolution: Bundler`).
- `verbatimModuleSyntax` is on: import types with `import { type X }` or `import type`.
- Run `npm run typecheck && npm test` before considering any change done. Both must be green.

## Commands

| Task | Command |
|---|---|
| Typecheck | `npm run typecheck` |
| Build | `npm run build` |
| Test | `npm test` |
| Dev (watch) | `npm run dev` |
| Inspect | `npm run inspect` |
