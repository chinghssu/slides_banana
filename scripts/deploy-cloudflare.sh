#!/bin/bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

"$PROJECT_ROOT/scripts/prepare-cloudflare-assets.sh"

cd "$PROJECT_ROOT"
npx --yes wrangler deploy
