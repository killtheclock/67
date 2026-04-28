#!/bin/bash
# pulse.sh

# Προσθήκη όλων των αλλαγών
git add .

# Commit με timestamp
git commit -m "Heartbeat: $(date +'%Y-%m-%d %H:%M:%S')"

# Push στο GitHub
git push origin main

echo "Pulse sent to GitHub at $(date)"
