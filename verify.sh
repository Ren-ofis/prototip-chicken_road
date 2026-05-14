#!/bin/bash
# Verification checklist for Chicken Crossing game

echo "🐔 Chicken Crossing - Setup Verification"
echo "========================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  Node.js version: $(node -v)"
else
    echo "  ✗ Node.js not found! Install from nodejs.org"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    echo "  npm version: $(npm -v)"
else
    echo "  ✗ npm not found!"
    exit 1
fi

# Check dependencies
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules exists"
else
    echo "  ✗ node_modules not found. Run: npm install"
    exit 1
fi

# Check package.json
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
    echo "  ✓ package.json found"
else
    echo "  ✗ package.json not found!"
    exit 1
fi

# Check source files
echo "✓ Checking source files..."
source_files=(
    "src/phaserMain.js"
    "src/preload.js"
    "src/scenes/Game.js"
    "src/scenes/Menu.js"
    "src/scenes/GameOver.js"
    "src/scenes/GameState.js"
    "src/scenes/Chicken.js"
    "src/scenes/Road.js"
    "src/scenes/UIManager.js"
    "src/scenes/GameBalance.js"
    "src/scenes/AssetGenerator.js"
)

for file in "${source_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file MISSING!"
    fi
done

# Check documentation
echo "✓ Checking documentation..."
docs=(
    "README.md"
    "QUICKSTART.md"
    "DESIGN.md"
    "DEVELOPER.md"
    "API.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✓ $doc"
    else
        echo "  ✗ $doc MISSING!"
    fi
done

# Check index.html
echo "✓ Checking index.html..."
if [ -f "index.html" ]; then
    echo "  ✓ index.html found"
else
    echo "  ✗ index.html not found!"
    exit 1
fi

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:5173"
echo "3. Read: QUICKSTART.md"
echo ""
echo "Happy chickening! 🐔"
