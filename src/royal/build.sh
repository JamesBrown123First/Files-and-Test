#!/bin/bash
# Build the Royal pages: HTML from partials, JS bundles with esbuild.
set -e
SITE=$(cd "$(dirname "$0")/../.." && pwd)
node "$SITE/src/royal/build-pages.mjs"
cd /home/claude/build
rm -rf "$SITE/dist/royal"
npx esbuild $SITE/src/royal/pages/*.jsx $SITE/src/royal/pages/*.js --bundle --splitting --format=esm --minify --jsx=automatic --target=es2020 \
  --outdir="$SITE/dist/royal" --chunk-names=chunks/[name]-[hash] --legal-comments=none --define:process.env.NODE_ENV='"production"' --log-level=warning
ls -la "$SITE/dist/royal" | head -20
