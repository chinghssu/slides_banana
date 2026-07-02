#!/bin/bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/.cloudflare-deploy"

mkdir -p "$OUTPUT_DIR"
find "$OUTPUT_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

cp "$PROJECT_ROOT/index.html" "$OUTPUT_DIR/index.html"
cp "$PROJECT_ROOT/app.js" "$OUTPUT_DIR/app.js"

echo "Prepared Cloudflare assets in $OUTPUT_DIR"
find "$OUTPUT_DIR" -maxdepth 1 -type f | sort
