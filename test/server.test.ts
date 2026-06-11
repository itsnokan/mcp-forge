import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

/**
 * Integration tests: a real MCP Client talks to the real server over an
 * in-memory transport. This proves the whole server is wired correctly without
 * spawning a process.
 */
describe("mcp-forge server (integration)", () => {
  let client: Client;

  beforeEach(async () => {
    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: "test-client", version: "1.0.0" });
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  });

  afterEach(async () => {
    await client.close();
  });

  it("lists the example tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    expect(names).toContain("echo");
    expect(names).toContain("calculate");
    expect(names).toContain("text_stats");
  });

  it("calls the calculate tool", async () => {
    const res = await client.callTool({
      name: "calculate",
      arguments: { a: 6, b: 7, operation: "multiply" },
    });
    const content = res.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe("42");
  });

  it("returns an error result on divide by zero", async () => {
    const res = await client.callTool({
      name: "calculate",
      arguments: { a: 1, b: 0, operation: "divide" },
    });
    expect(res.isError).toBe(true);
  });

  it("returns structured content from text_stats", async () => {
    const res = await client.callTool({
      name: "text_stats",
      arguments: { text: "Hello world" },
    });
    expect(res.structuredContent).toMatchObject({ characters: 11, words: 2 });
  });

  it("reads the static app-info resource", async () => {
    const res = await client.readResource({ uri: "info://app" });
    const first = res.contents[0] as { text: string };
    const parsed = JSON.parse(first.text);
    expect(parsed.name).toBe("mcp-forge");
  });

  it("reads a dynamic greeting resource", async () => {
    const res = await client.readResource({ uri: "greeting://Nokan" });
    const first = res.contents[0] as { text: string };
    expect(first.text).toContain("Hello, Nokan!");
  });

  it("exposes the code_review prompt", async () => {
    const { prompts } = await client.listPrompts();
    expect(prompts.map((p) => p.name)).toContain("code_review");
  });
});
