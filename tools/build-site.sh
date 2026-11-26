#!/bin/bash
# Builds the public Kingdom website (Regalia II only) into $1 (default /home/claude/websites).
# Copies only the finished files this page uses: no source, no Design studio, no other directions.
set -e
SRC=/home/claude/files-and-test; OUT=${1:-/home/claude/websites}
cd "$SRC"
LIST=$(mktemp)
grep -o '\(assets\|css\|dist\)/[A-Za-z0-9_./-]*' regalia2.html | sort -u > $LIST
for c in css/royal.css css/royal-regalia.css css/royal-regalia2.css; do grep -o '\.\./assets/[A-Za-z0-9_./-]*' $c | sed 's|^\.\./||' >> $LIST; done
ls dist/royal/chunks/*.js >> $LIST; ls assets/ads/*.webp >> $LIST
echo kingdom.config.js >> $LIST; ls css/royal*.css >> $LIST; echo assets/ads/ads.js >> $LIST
for d in assets css dist; do rm -rf "$OUT/$d"; done
sort -u $LIST | while read f; do [ -f "$f" ] && { mkdir -p "$OUT/$(dirname $f)"; cp "$f" "$OUT/$f"; }; done
python3 - "$SRC/regalia2.html" "$OUT/index.html" <<'PY'
import re,sys
s=open(sys.argv[1]).read()
s=s.replace('<head>','<head>\n<script>window.KINGDOM_PUBLIC=1;(window.KINGDOM_CFG=window.KINGDOM_CFG||{}).editor=false;(window.KINGDOM_CONFIG=window.KINGDOM_CONFIG||{}).editor=false;</script>',1)
s=re.sub(r'<a[^>]*href="index\.html"[^>]*>.*?</a>','',s,flags=re.S)
s=s.replace('href="regalia2.html','href="index.html')
s=re.sub(r'href="shop\.html[^"]*"','href="#shop"',s)
open(sys.argv[2],'w').write(s)
PY
rm -f $LIST; echo "built into $OUT: $(find $OUT -type f -not -path '*/.git/*' | wc -l) files"
