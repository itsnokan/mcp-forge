import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { textResult, errorResult } from "../lib/errors.js";

/**
 * Demonstrates: enum inputs, numeric validation, and returning a graceful
 * error result (divide-by-zero) instead of throwing.
 *
 * The pure `calculate` function is exported separately so it can be unit-tested
 * without spinning up a server — the pattern this boilerplate encourages.
 */
export const OPERATIONS = ["add", "subtract", "multiply", "divide"] as const;
export type Operation = (typeof OPERATIONS)[number];

export function calculate(a: number, b: number, operation: Operation): number {
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      if (b === 0) throw new Error("division by zero");
      return a / b;
  }
}

export function registerCalculate(server: McpServer): void {
  server.registerTool(
    "calculate",
    {
      title: "Calculator",
      description: "Perform a basic arithmetic operation on two numbers.",
      inputSchema: {
        a: z.number().describe("First operand"),
        b: z.number().describe("Second operand"),
        operation: z.enum(OPERATIONS).describe("Arithmetic operation to apply"),
      },
    },
    ({ a, b, operation }) => {
      try {
        return textResult(String(calculate(a, b, operation)));
      } catch (err) {
        return errorResult((err as Error).message);
      }
    },
  );
}
