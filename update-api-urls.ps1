# Script to update all localhost API URLs to use config

$clientSrcPath = "c:\Users\dell\Downloads\Programming\database system\client\src"
$configImport = "import { API_BASE_URL } from '../config';"
$configImportPages = "import { API_BASE_URL } from '../../config';"

# Get all .jsx and .js files
$files = Get-ChildItem -Path $clientSrcPath -Recurse -Include *.jsx,*.js | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*config.js*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Check if file contains localhost URLs
    if ($content -match "http://localhost:5000") {
        
        # Determine correct import path
        $importToUse = if ($file.Directory.Name -eq "pages") { $configImportPages } else { $configImport }
        
        # Add import if not already present
        if ($content -notmatch "import.*API_BASE_URL") {
            # Find the first import statement
            if ($content -match "(import.*?;[\r\n]+)") {
                $lastImport = $matches[0]
                $content = $content -replace [regex]::Escape($lastImport), "$lastImport$importToUse`r`n"
                $modified = $true
            }
        }
        
        # Replace all localhost URLs
        $content = $content -replace "'http://localhost:5000", "```${API_BASE_URL}"
        $content = $content -replace "`"http://localhost:5000", "```${API_BASE_URL}"
        $content = $content -replace "``http://localhost:5000", "```${API_BASE_URL}"
        
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nDone! Updated all API URLs to use config."
