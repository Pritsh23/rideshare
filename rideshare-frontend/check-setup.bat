@echo off
REM Rideshare Frontend - Installation Checker (Windows)

echo 🔍 Rideshare Frontend - Installation Checker
echo ============================================
echo.

setlocal enabledelayedexpansion

set passed=0
set failed=0

REM Check Node.js
echo 📦 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js installed: !NODE_VERSION!
    set /a passed+=1
) else (
    echo ✗ Node.js not found. Install from https://nodejs.org
    set /a failed+=1
)

REM Check npm
echo 📦 Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm installed: !NPM_VERSION!
    set /a passed+=1
) else (
    echo ✗ npm not found. Install Node.js with npm
    set /a failed+=1
)

REM Check git
echo 📦 Checking git...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('git --version') do set GIT_VERSION=%%i
    echo ⚠ git installed: !GIT_VERSION!
) else (
    echo ⚠ git not found (optional). Install from https://git-scm.com
)

REM Check project structure
echo.
echo 📂 Checking project structure...
if exist package.json (
    echo ✓ package.json found
    set /a passed+=1
) else (
    echo ✗ package.json not found. Make sure you're in rideshare-frontend directory
    set /a failed+=1
)

if exist src (
    echo ✓ src directory found
    set /a passed+=1
) else (
    echo ✗ src directory not found
    set /a failed+=1
)

REM Check node_modules
echo.
echo 📦 Checking dependencies...
if exist node_modules (
    echo ✓ node_modules found
    set /a passed+=1
) else (
    echo ⚠ node_modules not found. Run 'npm install'
)

REM Check vite config
echo.
echo ⚙️  Checking configuration files...
if exist vite.config.js (
    echo ✓ vite.config.js found
    set /a passed+=1
) else (
    echo ✗ vite.config.js not found
    set /a failed+=1
)

if exist tailwind.config.js (
    echo ✓ tailwind.config.js found
    set /a passed+=1
) else (
    echo ⚠ tailwind.config.js not found
)

REM Check important files
echo.
echo 📄 Checking important files...
for %%f in (src\main.jsx src\App.jsx src\context\AuthContext.jsx src\services\api.js index.html) do (
    if exist %%f (
        echo ✓ %%f found
        set /a passed+=1
    ) else (
        echo ✗ %%f missing
        set /a failed+=1
    )
)

REM Summary
echo.
echo ============================================
echo 📊 Summary
echo ============================================
echo Passed: !passed!
if %failed% gtr 0 (
    echo Failed: !failed!
)
echo.

if %failed% equ 0 (
    echo ✓ All checks passed! Ready to develop.
    echo.
    echo Next steps:
    echo 1. If node_modules not found, run: npm install
    echo 2. Start development server: npm run dev
    echo 3. Open http://localhost:3000 in your browser
) else (
    echo ✗ Some checks failed. See above for details.
)

echo.
pause
