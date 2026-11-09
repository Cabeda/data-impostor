import { describe, expect, test } from "bun:test";
import { parseCliArgs } from "./runtime.ts";

describe("parseCliArgs", () => {
  test("parses boolean and value options", () => {
    expect(parseCliArgs(["--all", "--query", "tag:ai"], ["all"], ["query"])).toEqual({ all: true, query: "tag:ai" });
  });

  test("accepts inline values", () => {
    expect(parseCliArgs(["--query=tag:ai"], [], ["query"])).toEqual({ query: "tag:ai" });
  });

  test("rejects missing, unknown, and malformed options", () => {
    expect(() => parseCliArgs(["--query"], [], ["query"])).toThrow("requires a value");
    expect(() => parseCliArgs(["--unknown"], [], [])).toThrow("Unknown option");
    expect(() => parseCliArgs(["positional"], [], [])).toThrow("Unexpected argument");
  });
});
