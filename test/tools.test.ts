import { describe, it, expect } from "vitest";
import { calculate } from "../src/tools/calculate.js";
import { textStats } from "../src/tools/textStats.js";

describe("calculate", () => {
  it("adds two numbers", () => {
    expect(calculate(2, 3, "add")).toBe(5);
  });

  it("subtracts, multiplies and divides", () => {
    expect(calculate(10, 4, "subtract")).toBe(6);
    expect(calculate(6, 7, "multiply")).toBe(42);
    expect(calculate(10, 2, "divide")).toBe(5);
  });

  it("throws on division by zero", () => {
    expect(() => calculate(1, 0, "divide")).toThrow(/zero/);
  });
});

describe("textStats", () => {
  it("counts characters and words", () => {
    const stats = textStats("Hello world");
    expect(stats.characters).toBe(11);
    expect(stats.words).toBe(2);
  });

  it("counts sentences", () => {
    expect(textStats("One. Two! Three?").sentences).toBe(3);
  });

  it("handles empty input", () => {
    expect(textStats("")).toEqual({ characters: 0, words: 0, lines: 0, sentences: 0 });
  });
});
