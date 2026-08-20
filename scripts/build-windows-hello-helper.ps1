$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$compiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$winMetadata = Join-Path $env:WINDIR 'System32\WinMetadata'
$runtime = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\System.Runtime.WindowsRuntime.dll'
$systemRuntime = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\System.Runtime.dll'
if (!(Test-Path -LiteralPath $compiler)) { throw 'C# compiler .NET Framework tidak ditemukan.' }
& $compiler /nologo /target:exe `
  "/out:$root\scripts\windows-hello-helper.exe" `
  "/r:$winMetadata\Windows.Foundation.winmd" `
  "/r:$winMetadata\Windows.Security.winmd" `
  "/r:$runtime" `
  "/r:$systemRuntime" `
  "$root\scripts\windows-hello-helper.cs"
if ($LASTEXITCODE -ne 0) { throw "Build Windows Hello helper gagal ($LASTEXITCODE)." }
Write-Output 'Windows Hello helper berhasil dibuat.'
