#!/bin/bash
set -e
cd /home/claude/build
rm -rf /home/claude/site/dist
ENTRIES=""
for f in src/pages/*.jsx src/pages/*.js; do [ -f "$f" ] && ENTRIES="$ENTRIES $f"; done
npx esbuild $ENTRIES --bundle --splitting --format=esm --minify --jsx=automatic --target=es2020 \
  --outdir=/home/claude/site/dist --chunk-names=chunks/[name]-[hash] --legal-comments=none --define:process.env.NODE_ENV='"production"' --log-level=warning
ls -la /home/claude/site/dist /home/claude/site/dist/chunks | head -30
