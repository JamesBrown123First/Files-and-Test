#!/bin/bash
# Builds the public Kingdom website (Regalia II only) into $1 (default /home/claude/websites).
# Copies only the finished files this page uses: no source, no Design studio, no other directions.
set -e
SRC=/home/claude/files-and-test; OUT=${1:-/home/claude/websites}
cd "$SRC"
LIST=$(mktemp)
grep -ho '\(assets\|css\|dist\)/[A-Za-z0-9_./-]*' regalia2.html shop.html | sort -u > $LIST
for c in css/royal.css css/royal-regalia.css css/royal-regalia2.css; do grep -o '\.\./assets/[A-Za-z0-9_./-]*' $c | sed 's|^\.\./||' >> $LIST; done
ls dist/royal/chunks/*.js >> $LIST; ls assets/ads/*.webp >> $LIST
echo kingdom.config.js >> $LIST; ls css/royal*.css >> $LIST; echo assets/ads/ads.js >> $LIST
for d in assets css dist; do rm -rf "$OUT/$d"; done
sort -u $LIST | while read f; do [ -f "$f" ] && { mkdir -p "$OUT/$(dirname $f)"; cp "$f" "$OUT/$f"; }; done
python3 - "$SRC" "$OUT" <<'PY'
import re,sys
src,out=sys.argv[1],sys.argv[2]
FLAGS='<head>\n<script>window.KINGDOM_PUBLIC=1;(window.KINGDOM_CFG=window.KINGDOM_CFG||{}).editor=false;(window.KINGDOM_CONFIG=window.KINGDOM_CONFIG||{}).editor=false;</script>'
for name,dest in (('regalia2.html','index.html'),('shop.html','shop.html')):
    s=open(f'{src}/{name}').read()
    s=s.replace('<head>',FLAGS,1)
    s=re.sub(r'<a[^>]*href="index\.html"[^>]*>.*?</a>','',s,flags=re.S)   # studio hub link
    s=s.replace('href="regalia2.html','href="index.html')
    s=re.sub(r'<title>[^<]*</title>', '<title>Kingdom Silver Collection — The Art of Silver Gifting</title>' if dest=='index.html' else '<title>Shop — Kingdom Silver Collection</title>', s, count=1)
    if dest=='shop.html':
        ids=set(re.findall(r'id="([^"]+)"',s))
        s=s.replace('class="r-head__logo" href="#top"','class="r-head__logo" href="index.html"')
        s=re.sub(r'href="#([a-z][a-z0-9-]*)"',lambda m: m.group(0) if m.group(1) in ids or m.group(1).startswith('k-') else f'href="index.html#{m.group(1)}"',s)
    open(f'{out}/{dest}','w').write(s)
PY

# performance: the public pages only use three typefaces, so every other @font-face (design-studio choices) is dropped,
# along with its font files
python3 - "$OUT" <<'PY'
import re,sys,os,glob
out=sys.argv[1]; KEEP=('Kalieb Luxury','Jost','Pinyon Script')
used=set()
for css in glob.glob(f'{out}/css/*.css'):
    s=open(css).read()
    def keep(m):
        fam=re.search(r"font-family:\s*['\"]?([^;'\"]+)",m.group(0)).group(1).strip()
        if fam in KEEP:
            used.update(re.findall(r'fonts/([A-Za-z0-9_.-]+\.woff2)',m.group(0))); return m.group(0)
        return ''
    s=re.sub(r'@font-face\s*\{[^}]*\}',keep,s)
    open(css,'w').write(s)
for f in glob.glob(f'{out}/assets/fonts/*'):
    if os.path.basename(f) not in used: os.remove(f)
print('fonts kept:',sorted(used))
PY
rm -f $LIST; echo "built into $OUT: $(find $OUT -type f -not -path '*/.git/*' | wc -l) files"
