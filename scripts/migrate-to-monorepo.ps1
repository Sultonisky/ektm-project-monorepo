# PowerShell Script untuk Migrasi ke Monorepo
# Usage: .\scripts\migrate-to-monorepo.ps1

Write-Host "🚀 EKTM Monorepo Migration Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Colors
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

# Function to show section
function Show-Section {
    param([string]$Title)
    Write-Host "`n📁 $Title" -ForegroundColor Cyan
    Write-Host ("=" * 50)
}

# Check prerequisites
Show-Section "Checking Prerequisites"
Write-Host "Checking Node.js..." -NoNewline
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = (node --version)
    Write-Host " ✓ $nodeVersion" -ForegroundColor $Green
} else {
    Write-Host " ✗ Not found" -ForegroundColor $Red
    Write-Host "Please install Node.js >= 18.0.0" -ForegroundColor $Red
    exit 1
}

Write-Host "Checking pnpm..." -NoNewline
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $pnpmVersion = (pnpm --version)
    Write-Host " ✓ $pnpmVersion" -ForegroundColor $Green
} else {
    Write-Host " ✗ Not found" -ForegroundColor $Red
    Write-Host "Please install pnpm >= 8.0.0" -ForegroundColor $Red
    exit 1
}

Write-Host "Checking Git..." -NoNewline
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = (git --version)
    Write-Host " ✓ $gitVersion" -ForegroundColor $Green
} else {
    Write-Host " ✗ Not found" -ForegroundColor $Yellow
    Write-Host "Warning: Git not found. Some features may not work." -ForegroundColor $Yellow
}

# Interactive migration
Show-Section "Migration Options"
Write-Host "Choose migration method:" -ForegroundColor $Yellow
Write-Host "  1. Manual migration (Recommended for beginners)"
Write-Host "  2. Git subtree migration (Preserves history)"
Write-Host "  3. Exit"
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n📋 Manual Migration Selected" -ForegroundColor $Green
        Write-Host "`nPlease follow these steps:" -ForegroundColor $Yellow
        Write-Host "  1. Download/clone your repos:"
        Write-Host "     - Backend (NestJS)"
        Write-Host "     - Admin Dashboard (SvelteKit)"
        Write-Host "     - Mobile (React Native)"
        Write-Host ""
        Write-Host "  2. Copy code to:"
        Write-Host "     - Backend → apps/backend/"
        Write-Host "     - Admin → apps/admin/"
        Write-Host "     - Mobile → apps/mobile/"
        Write-Host ""
        Write-Host "  3. EXCLUDE these folders from copying:"
        Write-Host "     - node_modules/"
        Write-Host "     - .git/"
        Write-Host "     - dist/, build/"
        Write-Host "     - .env"
        Write-Host ""
        Write-Host "  4. After copying, run: pnpm install"
        Write-Host ""
    }
    "2" {
        Write-Host "`n📋 Git Subtree Migration Selected" -ForegroundColor $Green
        
        $backendUrl = Read-Host "Enter Backend repo URL (or press Enter to skip)"
        $adminUrl = Read-Host "Enter Admin repo URL (or press Enter to skip)"
        $mobileUrl = Read-Host "Enter Mobile repo URL (or press Enter to skip)"
        
        Write-Host "`n⚠️  Git subtree migration requires manual setup" -ForegroundColor $Yellow
        Write-Host "Please refer to MIGRATION_GUIDE.md for detailed instructions"
    }
    "3" {
        Write-Host "Exit." -ForegroundColor $Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor $Red
        exit 1
    }
}

# Show next steps
Show-Section "Next Steps"
Write-Host "After migration:" -ForegroundColor $Yellow
Write-Host "  1. Run: pnpm install" -ForegroundColor $Green
Write-Host "  2. Run: pnpm db:generate" -ForegroundColor $Green
Write-Host "  3. Setup environment variables" -ForegroundColor $Green
Write-Host "  4. Test each app:" -ForegroundColor $Green
Write-Host "     - Backend:  pnpm --filter @monorepo-ektm/backend dev"
Write-Host "     - Admin:    pnpm --filter @monorepo-ektm/admin dev"
Write-Host "     - Mobile:   pnpm --filter @monorepo-ektm/mobile start"
Write-Host ""
Write-Host "📖 For detailed instructions, see: MIGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "Done! 🎉" -ForegroundColor $Green

