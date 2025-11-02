#!/bin/bash
# BuilderOS Installation Script
# Works on Mac and Linux

set -e

echo "🚀 Installing BuilderOS..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js first: https://nodejs.org"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION, recommend v18+"
fi

# Install BuilderOS globally
echo "📦 Installing builderos..."
npm install -g builderos

# Verify installation
if command -v builderos &> /dev/null; then
    echo ""
    echo "✅ BuilderOS installed successfully!"
    echo ""
    echo "🎉 Quick Start:"
    echo "   builderos setup    # Set up shell integration"
    echo "   builderos doctor   # Check everything works"
    echo "   builderos quick    # Make your first commit"
    echo ""
    echo "📚 Full docs: https://builderos.dev/docs"
else
    echo ""
    echo "❌ Installation failed"
    echo "   Try: npm install -g builderos"
    exit 1
fi

