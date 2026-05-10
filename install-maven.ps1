# Maven Installation and Setup Script for Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maven Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Maven is already installed
$mavenInstalled = $false
try {
    $mavenVersion = mvn -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Maven is already installed!" -ForegroundColor Green
        Write-Host $mavenVersion
        $mavenInstalled = $true
    }
} catch {
    Write-Host "Maven is not installed." -ForegroundColor Yellow
}

if (-not $mavenInstalled) {
    Write-Host ""
    Write-Host "Installing Maven..." -ForegroundColor Yellow
    Write-Host ""
    
    # Download Maven
    $mavenVersion = "3.9.6"
    $mavenUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $downloadPath = "$env:TEMP\apache-maven.zip"
    $installPath = "C:\Program Files\Apache\Maven"
    
    Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $downloadPath -UseBasicParsing
        Write-Host "✓ Download complete!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Download failed: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please download Maven manually from:" -ForegroundColor Yellow
        Write-Host "https://maven.apache.org/download.cgi" -ForegroundColor Cyan
        exit 1
    }
    
    # Extract Maven
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    try {
        if (Test-Path $installPath) {
            Remove-Item -Path $installPath -Recurse -Force
        }
        New-Item -ItemType Directory -Path $installPath -Force | Out-Null
        Expand-Archive -Path $downloadPath -DestinationPath $installPath -Force
        
        # Move files from nested directory
        $extractedDir = Get-ChildItem -Path $installPath -Directory | Select-Object -First 1
        Get-ChildItem -Path $extractedDir.FullName | Move-Item -Destination $installPath -Force
        Remove-Item -Path $extractedDir.FullName -Recurse -Force
        
        Write-Host "✓ Extraction complete!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Extraction failed: $_" -ForegroundColor Red
        exit 1
    }
    
    # Add to PATH
    Write-Host "Adding Maven to PATH..." -ForegroundColor Cyan
    try {
        $mavenBinPath = "$installPath\bin"
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        
        if ($currentPath -notlike "*$mavenBinPath*") {
            [Environment]::SetEnvironmentVariable(
                "Path",
                "$currentPath;$mavenBinPath",
                "Machine"
            )
            $env:Path = "$env:Path;$mavenBinPath"
            Write-Host "✓ Maven added to PATH!" -ForegroundColor Green
        } else {
            Write-Host "✓ Maven already in PATH!" -ForegroundColor Green
        }
    } catch {
        Write-Host "✗ Failed to add to PATH: $_" -ForegroundColor Red
        Write-Host "Please add manually: $installPath\bin" -ForegroundColor Yellow
    }
    
    # Set MAVEN_HOME
    Write-Host "Setting MAVEN_HOME..." -ForegroundColor Cyan
    try {
        [Environment]::SetEnvironmentVariable("MAVEN_HOME", $installPath, "Machine")
        $env:MAVEN_HOME = $installPath
        Write-Host "✓ MAVEN_HOME set!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to set MAVEN_HOME: $_" -ForegroundColor Red
    }
    
    # Clean up
    Remove-Item -Path $downloadPath -Force
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Maven Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Please restart your terminal/PowerShell window" -ForegroundColor Yellow
    Write-Host "for the PATH changes to take effect." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verifying Maven installation..." -ForegroundColor Cyan
try {
    $version = mvn -version
    Write-Host "✓ Maven is working!" -ForegroundColor Green
    Write-Host $version
} catch {
    Write-Host "✗ Maven verification failed." -ForegroundColor Red
    Write-Host "Please restart your terminal and try again." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor White
Write-Host "2. Navigate to: cd backend" -ForegroundColor White
Write-Host "3. Build project: mvn clean install" -ForegroundColor White
Write-Host "4. Run backend: mvn spring-boot:run" -ForegroundColor White
