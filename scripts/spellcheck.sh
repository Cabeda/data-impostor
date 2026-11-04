#!/usr/bin/env bash
set -euo pipefail
tmp="${TMPDIR:-/tmp}/di-spellcheck"
rm -rf "$tmp"
mkdir -p "$tmp"
find src/data -type f -name '*.md' -print0 | while IFS= read -r -d '' f; do
  rel="${f#src/data/}"
  mkdir -p "$tmp/$(dirname "$rel")"
  sed -E 's/\[[^]]*\]\([^)]*\)//g' "$f" > "$tmp/$rel"
done
find "$tmp" -type f -name '*.md' -print0 | xargs -0 codespell --config .codespellrc