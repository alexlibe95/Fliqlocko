#!/bin/bash
# Wrapper script to run Electron in dev mode while filtering harmless GL/VSync errors

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project directory
cd "$PROJECT_DIR"

# Run Electron and filter out harmless GL/VSync errors using sed
# sed preserves exit codes and filters lines in real-time
npx electron . --no-sandbox --disable-setuid-sandbox 2>&1 | \
  sed -u '/gl_surface_presentation_helper/d; /GetVSyncParametersIfAvailable/d'

# Get the exit code from Electron
EXIT_CODE=${PIPESTATUS[0]}
exit $EXIT_CODE

