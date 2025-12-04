#!/bin/bash
# Helper script to start Electron with proper flags
export NODE_ENV=development
exec electron . --no-sandbox --disable-setuid-sandbox "$@"

