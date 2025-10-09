# TipUp Setup Script for Windows PowerShell
# Optimized for minimal dependencies

Write-Host "🪙 Setting up TipUp - Universal Tipping App on Push Chain" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location app
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Install contract dependencies
Write-Host "📦 Installing contract dependencies..." -ForegroundColor Yellow
Set-Location ../hardhat
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install contract dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contract dependencies installed" -ForegroundColor Green

# Compile contracts
Write-Host "🔨 Compiling smart contracts..." -ForegroundColor Yellow
npm run compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green

# Create .env.local file if it doesn't exist
Set-Location ../app
if (!(Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    @"
# TipUp Contract Configuration
NEXT_PUBLIC_TIPUP_CONTRACT=0xYourDeployedContractAddress

# Push Chain Configuration
NEXT_PUBLIC_PUSH_RPC_URL=https://rpc.push.org
NEXT_PUBLIC_PUSH_CHAIN_ID=999

# Push SDK Configuration (optional)
NEXT_PUBLIC_PUSH_API_KEY=your_push_api_key_here
"@ | Out-File -FilePath .env.local -Encoding UTF8
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env.local already exists" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update the contract address in app/.env.local after deployment"
Write-Host "2. Deploy the contract: cd hardhat && npm run deploy"
Write-Host "3. Run the frontend: cd app && npm run dev"
Write-Host ""
Write-Host "📚 For more information, check the README.md file" -ForegroundColor Blue
