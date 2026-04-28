#!/bin/bash
echo "--- STARTING GLOBAL HEARTBEAT ---"

# 1. Έλεγχος HTML (για βασικά tags)
if grep -q "</body>" index.html; then
    echo "[OK] index.html looks complete."
else
    echo "[ERROR] index.html is missing </body> tag!"
fi

# 2. Έλεγχος JSON (Syntax Check)
for f in data/questions/*.json; do
    node -e "try { JSON.parse(require('fs').readFileSync('$f')); console.log('[OK] $f is valid'); } catch(e) { console.error('[ERROR] $f is broken:', e.message); process.exit(1); }"
done

# 3. Git Push
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git add .
git commit -m "Global Heartbeat: $TIMESTAMP"
git push origin main

echo "--- PULSE SENT AT $TIMESTAMP ---"
