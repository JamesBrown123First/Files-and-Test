#!/bin/bash
# Build the round-five (Crown) pages: HTML, then JS bundles with esbuild.
set -e
SITE=$(cd "$(dirname "$0")/../.." && pwd)
node "$SITE/src/crown/build.mjs"
cd /home/claude/build
rm -rf "$SITE/dist/crown"
npx esbuild $SITE/src/crown/pages/*.js --bundle --splitting --format=esm --minify --target=es2020 \
  --outdir="$SITE/dist/crown" --chunk-names=chunks/[name]-[hash] --legal-comments=none --log-level=warning
ls -la "$SITE/dist/crown"
