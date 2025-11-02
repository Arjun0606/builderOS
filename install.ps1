# BuilderOS Installation Script for Windows PowerShell

Write-Host "🚀 Installing BuilderOS..." -ForegroundColor Blue
Write-Host ""

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "   Please install Node.js first: https://nodejs.org"
    exit 1
}

# Check Node version
$nodeVersionString = node -v
$nodeVersion = [int]($nodeVersionString -replace 'v' -replace '\.\d+\.\d+', '')
if ($nodeVersion -lt 18) {
    Write-Host "⚠️  Node.js version is v$nodeVersion, recommend v18+" -ForegroundColor Yellow
}

# Install BuilderOS globally
Write-Host "📦 Installing builderos..." -ForegroundColor Cyan
npm install -g builderos

# Verify installation
$builderosInstalled = Get-Command builderos -ErrorAction SilentlyContinue
if ($builderosInstalled) {
    Write-Host ""
    Write-Host "✅ BuilderOS installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Quick Start:" -ForegroundColor Yellow
    Write-Host "   builderos setup    # Set up shell integration"
    Write-Host "   builderos doctor   # Check everything works"
    Write-Host "   builderos quick    # Make your first commit"
    Write-Host ""
    Write-Host "📚 Full docs: https://builderos.dev/docs"
} else {
    Write-Host ""
    Write-Host "❌ Installation failed" -ForegroundColor Red
    Write-Host "   Try: npm install -g builderos"
    exit 1
}

