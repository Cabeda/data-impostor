import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { checkEntryDate, isUndatedPage } from "./content-intake.ts";
import type { IntakeCollection } from "./content-intake.ts";

export interface IdentityGlobOptions {
  collection: IntakeCollection;
  base: string;
  pattern: string;
}

/**
 * A glob loader that keeps the collection's interface honest: every entry it
 * loads must satisfy `checkEntryDate`, so a post whose `pubDate` disagrees with
 * its path fails `astro dev`, `astro check` and `astro build` alike.
 *
 * It delegates the loading, so Astro still computes the ids — the check can
 * never drift from the URL rule it is checking.
 */
export function identityGlob({
  collection,
  base,
  pattern,
}: IdentityGlobOptions): Loader {
  const inner = glob({ base, pattern });

  return {
    name: `identity-glob:${collection}`,
    load: async (context) => {
      await inner.load(context);

      const failures: string[] = [];
      for (const entry of context.store.values()) {
        if (isUndatedPage(collection, entry.id)) {
          continue;
        }
        const problem = checkEntryDate(collection, entry.id, entry.data.pubDate);
        if (problem) {
          failures.push(problem);
        }
      }

      if (failures.length > 0) {
        const noun = failures.length === 1 ? "entry" : "entries";
        throw new Error(
          `Content intake rejected ${failures.length} ${collection} ${noun}:\n` +
            failures.map((failure) => `  - ${failure}`).join("\n"),
        );
      }
    },
  };
}
