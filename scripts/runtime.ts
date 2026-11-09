import { readdir } from "node:fs/promises";
import { join } from "node:path";

export type CliFlags = Record<string, boolean | string | undefined>;

export function parseCliArgs(
  args: string[],
  booleanOptions: string[],
  stringOptions: string[] = [],
): CliFlags {
  const flags: CliFlags = {};
  const bools = new Set(booleanOptions);
  const strings = new Set(stringOptions);
  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const [name, inlineValue] = token.slice(2).split("=", 2);
    if (bools.has(name)) {
      if (inlineValue !== undefined) throw new Error(`--${name} does not take a value`);
      flags[name] = true;
    } else if (strings.has(name)) {
      const value = inlineValue ?? args[++i];
      if (value === undefined || value.startsWith("--")) throw new Error(`--${name} requires a value`);
      flags[name] = value;
    } else throw new Error(`Unknown option: --${name}`);
  }
  return flags;
}

export async function* walkFiles(root: string): AsyncGenerator<string> {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) yield* walkFiles(path);
    else if (entry.isFile()) yield path;
  }
}
