#!/bin/bash

echo "🔍 Rideshare Frontend - Installation Checker"
echo "============================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
passed=0
failed=0

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    ((passed++))
else
    echo -e "${RED}✗${NC} Node.js not found. Install from https://nodejs.org"
    ((failed++))
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
    ((passed++))
else
    echo -e "${RED}✗${NC} npm not found. Install Node.js with npm"
    ((failed++))
fi

# Check git
echo "📦 Checking git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} git installed: $GIT_VERSION"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} git not found (optional). Install from https://git-scm.com"
fi

# Check if in correct directory
echo ""
echo "📂 Checking project structure..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json found"
    ((passed++))
else
    echo -e "${RED}✗${NC} package.json not found. Make sure you're in rideshare-frontend directory"
    ((failed++))
fi

if [ -d "src" ]; then
    echo -e "${GREEN}✓${NC} src/ directory found"
    ((passed++))
else
    echo -e "${RED}✗${NC} src/ directory not found"
    ((failed++))
fi

# Check node_modules
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    PACKAGE_COUNT=$(ls node_modules | wc -l)
    echo -e "${GREEN}✓${NC} node_modules found ($PACKAGE_COUNT packages)"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} node_modules not found. Run 'npm install'"
fi

# Check vite config
echo ""
echo "⚙️  Checking configuration files..."
if [ -f "vite.config.js" ]; then
    echo -e "${GREEN}✓${NC} vite.config.js found"
    ((passed++))
else
    echo -e "${RED}✗${NC} vite.config.js not found"
    ((failed++))
fi

if [ -f "tailwind.config.js" ]; then
    echo -e "${GREEN}✓${NC} tailwind.config.js found"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} tailwind.config.js not found"
fi

# Check important files
echo ""
echo "📄 Checking important files..."
IMPORTANT_FILES=("src/main.jsx" "src/App.jsx" "src/context/AuthContext.jsx" "src/services/api.js" "index.html")
for file in "${IMPORTANT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file found"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $file missing"
        ((failed++))
    fi
done

# Backend check
echo ""
echo "🖥️  Checking backend connectivity..."
if curl -s http://localhost:8080/actuator/health &> /dev/null; then
    echo -e "${GREEN}✓${NC} Backend is running on http://localhost:8080"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Backend not accessible at http://localhost:8080"
    echo -e "   Make sure your backend is running: ./mvnw spring-boot:run"
fi

# Summary
echo ""
echo "============================================"
echo "📊 Summary"
echo "============================================"
echo -e "${GREEN}Passed: $passed${NC}"
if [ $failed -gt 0 ]; then
    echo -e "${RED}Failed: $failed${NC}"
fi
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to develop.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. If node_modules not found, run: npm install"
    echo "2. Start development server: npm run dev"
    echo "3. Open http://localhost:3000 in your browser"
else
    echo -e "${RED}✗ Some checks failed. See above for details.${NC}"
fi

echo ""
