/**
 * Structured stderr logger.
 *
 * CRITICAL for stdio MCP servers: stdout carries the JSON-RPC protocol, so a
 * single stray `console.log` corrupts the stream. Every diagnostic MUST go to
 * stderr. This logger enforces that.
 */
type Level = "debug" | "info" | "warn" | "error";

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function threshold(): number {
  const fromEnv = (process.env.LOG_LEVEL as Level | undefined) ?? "info";
  return LEVELS[fromEnv] ?? LEVELS.info;
}

function write(level: Level, msg: string, meta?: unknown): void {
  if (LEVELS[level] < threshold()) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...(meta !== undefined ? { meta } : {}),
  };
  process.stderr.write(`${JSON.stringify(entry)}\n`);
}

export const logger = {
  debug: (msg: string, meta?: unknown) => write("debug", msg, meta),
  info: (msg: string, meta?: unknown) => write("info", msg, meta),
  warn: (msg: string, meta?: unknown) => write("warn", msg, meta),
  error: (msg: string, meta?: unknown) => write("error", msg, meta),
};
